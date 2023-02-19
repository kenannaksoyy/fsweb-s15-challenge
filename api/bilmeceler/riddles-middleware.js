const { findRiddle } = require("../models/riddles-model");

const riddleCheck = (req, res, next) => {
    const {bilmece} = req.body;
    if(bilmece===undefined || !bilmece){
        next({
            status:400,
            message:"bilmece yok"
        })
    }
    else{
        next();
    }
}
const riddleUnique = async(req, res, next) => {
    try{
        const possible = await findRiddle({bilmece:req.body.bilmece});
        if(possible){
            next({
                status:401,
                message:"zaten var"
            })
        }
        else{
            next();
        }
    }
    catch(err){
        next(err);
    }
}
module.exports = {
    riddleCheck,riddleUnique
}