const router = require("express").Router();
const Message = require("../models/Message");

router.post('/',async(req,res)=>{
    const message=new Message(req.body);
    try {
        const savedMessages=await message.save();
        res.status(201).json(savedMessages);
    } catch (error) {
        res.status(500).json(error);
    }
})

//get all messages for a specific chat
router.get('/:id',async(req,res)=>{
    try {
        const messages=await Message.find({
            conversationId:req.params.id
        });
        res.status(201).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
