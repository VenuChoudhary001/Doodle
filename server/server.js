const express=require('express');
const app=express();
const server = require('http').Server(app);
const {Server}=require("socket.io");


const io=new Server(server,{
    cors:{
        origin:"*"
    }
})

io.on("connection",(socket)=>{
    console.log("user connected")
    socket.on("begin-path",data=>{
        console.log("begin-path")
        socket.broadcast.emit("begin-path",data)
    })
    socket.on("end-path",(data)=>{
        console.log("end-path")
        socket.broadcast.emit("end-path",data);
    })
})
const PORT=9000
server.listen(PORT,()=>{
    console.log("Server is listening on PORT ",PORT);
})