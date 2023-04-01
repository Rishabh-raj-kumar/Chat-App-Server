const router = require('express').Router()
const messageModel = require("../models/messageModel")

router.post('/addmsg',async (req, res, next) => {
   try{
       const {from , to, message} = req.body;
       const data = await messageModel.create({
          message : {text : message},
          users : [from,to],
          sender:from
       });
       if(data) return res.json({ msg : "message added success.."});
    return res.json({ msg : "message failed to add in database..."});
    }
   catch(ex){
      next(ex);
   }
})

router.post('/getmsg',async (req, res, next) => {
   try{
     const {from,to} = req.body;
     const messages = await messageModel.find({
      users:{
         $all:[from,to]
      }
     }).sort({ updatedAt:1})

     const projectMessages = messages.map((msg) =>{
      return{
         fromSelf: msg.sender.toString() === from,
         message:msg.message.text,
      }
     })
     res.json(projectMessages);
   }
   catch(ex){
      next(ex);
   }
})
module.exports = router;