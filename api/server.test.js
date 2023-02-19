// testleri buraya yazın
const superTest = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./secrets/secretTok"); 

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

test('[0] Testler çalışır durumda]', () => {
  expect(true).toBe(true)
});

describe("Server Test", ()=>{
  it("[1] Server Deneme /", async() => {
      const res = await superTest(server).get("/");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Server Get Deneme");
  },1000);

  it("[2] Server Deneme /dada", async() => {
      const res = await superTest(server).get("/dada");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Oops Sayfa Yok");
  },1000)
});

describe("[Post] auth/register Test", () => {
  it("[3] username boşyok", async() => {
    const res = await superTest(server).post("/api/auth/register")
    .send({"username": "", "password": 1234});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username veya password eksik");
    const res2 = await superTest(server).post("/api/auth/register")
    .send({"password": 1234});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username veya password eksik");
  },1000);
  it("[4] password boş-yok", async() => {
    const res = await superTest(server).post("/api/auth/register")
    .send({"username": "apaci", "password": ""});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username veya password eksik");
    const res2 = await superTest(server).post("/api/auth/register")
    .send({"username": "apaci"});
    expect(res2.status).toBe(400);
    expect(res2.body.message).toBe("username veya password eksik");
  },1000);
  it("[5] username bosta değilse", async() => {
    const res = await superTest(server).post("/api/auth/register")
    .send({"username": "Wolwerine", "password": 123456789});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Username alınmış");
  },1000);
  it("[6] geçerli durum user donuyormu", async() => {
    const res = await superTest(server).post("/api/auth/register")
    .send({"username": "Apaci", "password": "12345"});
    expect(res.status).toBe(201);
    expect(res.body["username"]).toBe("Apaci");
    expect(bcrypt.compareSync('12345', res.body["password"])).toBeTruthy();
  },1000);
  it("[7] geçerli durum user db eklenme", async() => {
    const res = await superTest(server).post("/api/auth/register")
    .send({"username": "Apaci", "password": "12345"});
    expect(res.status).toBe(201);
    const dbUser = await db('users').where({user_id: res.body["user_id"]}).first()
    expect(bcrypt.compareSync('12345', dbUser["password"])).toBeTruthy();
    expect(dbUser["role_id"]).toBe(2);
  },1000);
});

/*testte hata çıkıyor expected kısmında ama passedladı
describe("[POST] auth/login Test", () => {
  it("[8] username boşyok", async() => {
    const datas = [
      {"username": "", "password": 1234},
      {"password": 1234},
      {"username": "apaci", "password": ""},
      {"username": "apaci"}
    ];
    datas.forEach( async d => {
    const res = await superTest(server).post("/api/auth/login")
    .send(d);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username veya password eksi");
    }) 
  },1000);
})
*/
describe("[POST] auth/login Test", () => {
  it("[8] username password boşyok", async() => {
    const d = [
      {"username": "", "password": 1234},
      {"password": 1234},
      {"username": "apaci", "password": ""},
      {"username": "apaci"}
    ];
    const res1= await superTest(server).post("/api/auth/login").send(d[0]);
    expect(res1.status).toBe(400);
    expect(res1.body.message).toBe("username veya password eksik");
    const res2= await superTest(server).post("/api/auth/login").send(d[1]);
    expect(res2.status).toBe(400);
    expect(res2.body.message).toBe("username veya password eksik");
    const res3= await superTest(server).post("/api/auth/login").send(d[2]);
    expect(res3.status).toBe(400);
    expect(res3.body.message).toBe("username veya password eksik");
    const res4= await superTest(server).post("/api/auth/login").send(d[3]);
    expect(res4.status).toBe(400);
    expect(res4.body.message).toBe("username veya password eksik");   
  },1000);
  it("[9] username db varmı", async() => {
    const input = {"username": "Wolwerinee", "password": 1234};
    const res= await superTest(server).post("/api/auth/login").send(input);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Geçersiz Kriter");
  },1000);
  it("[10] login başarılımı hi", async() => {
    const input = {"username": "Wolwerine", "password": 1234};
    const res= await superTest(server).post("/api/auth/login").send(input);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("welcome, Wolwerine");
  },1000);
  it("[11] login başarılımı token", async() => {
    const input = {"username": "Wolwerine", "password": 1234};
    const res= await superTest(server).post("/api/auth/login").send(input);
    jwt.verify(res.body.token,JWT_SECRET,
      (err, decoToken) => {
        if(err){
          expect("patladı").toBe("pataladadadad");
        }
        else{
          expect(res.status).toBe(200);
          expect(decoToken.username).toBe("Wolwerine");
        }
      }
    );  
  },1000);
});

describe("[GET] /bilmeceler test", () => {
  it("[12] tokensiz bilmeceler geliyormu", async() => {
    const res= await superTest(server).get("/api/bilmeceler");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("token gereklidir");
  },1000);
  it("[13] tokenli bilmeceler geliyormu", async() => {
    const input = {"username": "Wolwerine", "password": 1234};
    const res= await superTest(server).post("/api/auth/login").send(input);
    const res1 = await superTest(server).get('/api/bilmeceler').set('Authorization', res.body.token);
    expect(res1.status).toBe(200);
    expect(res1.body).toHaveLength(3);
  },1000);
  it("[14] token mevcut dışı", async() => {
    const input = {"username": "Wolwerine", "password": 1234};
    const res= await superTest(server).post("/api/auth/login").send(input);
    const res1 = await superTest(server).get('/api/bilmeceler').set('Authorization', "res.body.token");
    expect(res1.status).toBe(401);
    expect(res1.body.message).toBe("token geçersizdir");
  },1000);
});
describe("[POST] /bilmeceler test", () => {
  it("[15] token yetki dışı", async() => {
    const input = {"username": "Wolwerine", "password": 1234};
    const res= await superTest(server).post("/api/auth/login").send(input);
    const res1 = await superTest(server).post('/api/bilmeceler').set('Authorization', res.body.token).send({"bilmece":"agugagu"});
    expect(res1.status).toBe(403);
    expect(res1.body.message).toBe("yetkin yok");
  },1000);
  it("[16] token yetkili", async() => {
    const input = {"username": "Prof.X", "password": 1234};
    const res= await superTest(server).post("/api/auth/login").send(input);
    const res1 = await superTest(server).post('/api/bilmeceler').set('Authorization', res.body.token).send({"bilmece":"agugagu"});
    expect(res1.status).toBe(201);
    expect(res1.body.bilmece).toBe("agugagu");
  },1000);
  it("[17] token yetkili bilmece yokbos", async() => {
    const input = {"username": "Prof.X", "password": 1234};
    let res = await superTest(server).post("/api/auth/login").send(input);
    let res1 = await superTest(server).post('/api/bilmeceler').set('Authorization', res.body.token).send({"bilmece":""});
    expect(res1.status).toBe(400);
    expect(res1.body.message).toBe("bilmece yok");
    const res2 = await superTest(server).post('/api/bilmeceler').set('Authorization', res.body.token).send({});
    expect(res2.status).toBe(400);
    expect(res2.body.message).toBe("bilmece yok");
  },1000);
});
