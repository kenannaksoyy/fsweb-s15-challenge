exports.justAdmin = (req,res,next) => {
    if(req.decoToke.rolename === "admin"){
        next();
    }
    else{
        next({
          status: 403,
          message: "yetkin yok",
        });
    }
}