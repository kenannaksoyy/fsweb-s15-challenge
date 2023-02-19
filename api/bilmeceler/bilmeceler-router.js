// değişiklik yapmayın
const router = require('express').Router();
const { allRiddles, insertRidle } = require("../models/riddles-model");
const bilmeceler = require('./bilmeceler-data');
const {justAdmin} = require("../middleware/justAdmin");
const { riddleCheck, riddleUnique } = require('./riddles-middleware');

router.get('/', async(req, res, next) => {
  try{
    const riddles = await allRiddles();
    res.status(200).json(riddles);
  }
  catch(err){
    next(err);
  }
});
router.post("/", justAdmin,riddleCheck,riddleUnique,async (req, res, next) => {
  try{
    const createdRiddle = await insertRidle(req.body);
    res.status(201).json(createdRiddle);
  }
  catch(err){
    next(err);
  }
})

module.exports = router;
