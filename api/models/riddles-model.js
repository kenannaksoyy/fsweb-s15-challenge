const db = require("../../data/dbConfig");
const uuidv4 = require("uuid")
const allRiddles = () => {
    return db("riddles as r").select("r.bilmece");
}
const findRiddle = (riddle) => {
    return db("riddles").where(riddle).first();
}
const insertRidle = async (riddle) => {
    riddle.id=uuidv4.v4();
    await db("riddles").insert(riddle);
    return await db("riddles").where({id:riddle.id}).first();
}
module.exports={
    allRiddles,insertRidle,findRiddle
}