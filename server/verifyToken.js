const jwt=require("jsonwebtoken")
const verifyToken=async(req,res)=>{
    const token=req.cookies.token;
    if(!token)
    {
        return res.status(401).send({auth:false,message:"No Token Provided"});
    }
    try{
        jwt.verify(token,process.env.JWT,(error,user)=>{
            if(error)
            {
                 return res.status(500).send({ auth: false, message: "Invalid Token" });
            }
            else{
                req.user = user;
                next();
            }
        })
    }
    catch(ex){
        console.log(ex);
        return res.status(400).send({auth: false, message: 'Fail to authenticate token.'})
    }
}

module.exports={verifyToken};