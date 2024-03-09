const io=require("socket.io")(8000,{
    cors:{
        origin:"http://localhost:3000",
    }
});


let users=[];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser=(socketId)=>{
     users = users.filter((user)=> (user.socketId !== socketId))

}

const getUser=(userId)=>{
    return users.find((user)=>user.userId===userId)
}

io.on("connect",(socket)=>{
  console.log("a user connected");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUser", users);
  });

  // socket.on("sendMessage",data=>{
  //     console.log(data);
  // })

  socket.on("sendMessage", ({senderId, receiverId, msg}) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        msg,
      });
    } else {
      console.log(`User with id ${receiverId} not found.`);
    }
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUser", users);
  });
})


