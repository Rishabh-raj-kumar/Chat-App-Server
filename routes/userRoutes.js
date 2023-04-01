const router = require('express').Router()
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

router.post('/register',async (req, res, next) => {
   try{
    const {username,email,password} = req.body;
    const userNameCheck = await User.findOne({username});
    if(userNameCheck)
    {
        return res.json({msg:"UserName already exits..",status:false});
    }
    const emailCheck = await User.findOne({email});
    if(emailCheck)
    {
        return res.json({msg:"Email already exits..",status:false});
    }

    const hashedPassword = await bcrypt.hash(password,10);
   const user = await User.create({
    email,
    username,
    password:hashedPassword
   });
   delete user.password;
   return res.json({ status:true, user})
   }
   catch(exp){
     next(exp)
   }
})

router.post('/login',async (req, res, next) => {
  try{
   const {username,password} = req.body;
   const user = await User.findOne({username});
   if(!user)
   {
       return res.json({msg:"Incorrect username or password",status:false});
   }
   const isPass = await bcrypt.compare(password, user.password);
   if(!isPass){
    return res.json({msg:"Incorrect password",status:false});
   }
   delete user.password;
  return res.json({ status:true, user})
  }
  catch(exp){
    next(exp)
  }
})

router.post('/setAvatar/:id',async (req,res,next) =>{
   try{
     const userId = req.params.id;
     const avatarImage  = req.body.image;
     const userData = await User.findByIdAndUpdate(userId,{
      isAvatarSet:true,
      avatarImage: avatarImage
     });
     return res.json({ isSet:userData.isAvatarSet,image:userData.avatarImage});
   }
   catch(ex){
    next(ex)
   }
})

router.get('/allusers/:id',async (req,res,next) =>{
  try{
     const users = await User.find({_id:{$ne:req.params.id}}).select([
      "email","username","avatarImage","_id"
     ])
     return res.json(users)
  }
  catch(ex){
    next(ex)
  }
})

module.exports = router;