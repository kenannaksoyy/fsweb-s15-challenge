const mW = require('./auth-middleware');
const bcrypt = require('bcryptjs');
const { insertUser } = require('../models/users-model');
const { createUserToken } = require('../utils/createUserToken');

const router = require('express').Router();

router.post('/register',mW.inputCheck,mW.usernameCheck, async(req, res,next) => {
  try{
    const hashPassword = bcrypt.hashSync(req.body.password, 8);
    const userObj = {
      username:req.body.username,
      password:hashPassword,
      rolename:"user"
    };
    const createdUser=await insertUser(userObj);
    res.status(201).json(createdUser);
  }
  catch(err){
    next(err);
  }
});

router.post('/login',mW.inputCheck,mW.usernameCheck,mW.passwordCheck, (req, res, next) => {
  try{
    const payload = {
        username: req.user.username,
        rolename: req.user.rolename
    }
    const token = createUserToken(payload,"1d");
    res.status(200).json({
      message:`welcome, ${req.user.username}`,
      token:token,
      user:req.user
    });
  }
  catch(err){
    next(err);
  }
});

module.exports = router;
