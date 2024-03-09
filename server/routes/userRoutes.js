const router=require("express").Router();
const User=require("../models/User")
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
router.post('/register',async(req,res)=>{
     const hashPassword = await bcrypt.hash(req.body.password, 10);
     const newUser = new User({ ...req.body, password: hashPassword });
    try {
        const savedUser=await newUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/login',async(req,res)=>{
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user)
          return res.status(400).json("No account found with this email");
        const validPassord = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!validPassord) return res.status(401).json("Wrong Password");
        const token=jwt.sign({_id:user._id,email:user.email,user:user.username},process.env.JWT,
            {expiresIn:"3d"})

            res.cookie("token",token,{
                httpOnly:true,
                secure:true,
                sameSite:"none"
            })
            const {password,...other}=user._doc;
            res.status(200).json({token,other});
    } catch (error) {
        res.status(500).json(error);
    }   
})


router.get('/:id',async(req,res)=>{
    const userId=req.params.id;
    try {
        const user=await User.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports=router;