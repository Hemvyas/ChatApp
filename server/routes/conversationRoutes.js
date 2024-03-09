const router=require("express").Router();
const Conversation=require("../models/Conversation");
const User = require("../models/User");

router.post('/',async(req,res)=>{
   const newConversation=new Conversation({
    members:[req.body.senderId,req.body.receiverId]
   })
   try {
    const savedConversation=await newConversation.save();
    res.status(200).json(savedConversation);
   } catch (error) {
    res.status(500).json(error);
   }
})

router.get("/search", async (req, res) => {
  const { username } = req.query;

  try {
    const users = await User.find({
      username: { $regex: new RegExp(username, "i") },
    });
    const userIds = users.map((user) => user._id.toString());
    const conversations = await Conversation.find({
      members: { $in: userIds },
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id',async(req,res)=>{
    try {
       const conversation=await Conversation.find({
        members:{$in:[req.params.id]}
       })
        res.status(200).json(conversation);       
    } catch (error) {
       res.status(500).json(error); 
    }
})

module.exports=router;