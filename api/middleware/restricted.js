const { JWT_SECRET } = require("../secrets/secretTok"); 
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try{
    let token = req.headers["authorization"];
    if(!token){
      next({
        status:401,
        message:"token gereklidir"
      })
    }
    else{
      jwt.verify(token, JWT_SECRET, (err, decoToke)=>{
        if(err){
          next({
            status:401,
            message:"token geçersizdir"
          })
        }
        else{
          req.decoToke=decoToke;
          next();
        }
      })
    }
  }
  catch(err){
    next(err);
  }
};
