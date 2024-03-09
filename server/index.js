const express=require("express");
const mongoose=require("mongoose")
const dotenv = require("dotenv");
const cors=require("cors")
const userRoutes=require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cookieParser=require("cookie-parser");
dotenv.config();

const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
const PORT=5000 || process.env.PORT;

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log('connected to the database')
}).catch((err)=>{
    console.log(`error connecting to the database ${err}`);
})
    
app.use('/api/auth',userRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);

app.listen(5000,()=>{
    console.log(`Server listening at ${PORT}` );
})