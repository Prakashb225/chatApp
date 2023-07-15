const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const http = require('http');
const socketio = require('socket.io');
const formatMessage =require('./utils/messages');
const {userjoin, getcurrentUser , userleaves ,getuserrooms} = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server);
app.use(express.static(path.join(__dirname,'public')))

const botname = 'chatcord bot'

io.on('connection',socket=>{
    socket.on('joinroom' ,({username ,room})=>{

        const user=userjoin(socket.id,username,room)

        socket.join(user.room);

    socket.emit('message',formatMessage(botname,'welcome to chatcord !'));
    
    //Broadcast when user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botname,`${user.username} join the chat`));

    //send user and room info
    io.to(user.room).emit('roomuser',{
        room:user.room,
        users:getuserrooms(user.room)
    })



    //listen a chat message
    socket.on('chatmessage',msg=>{
        const user=getcurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })

    //runs when client disconnects


    socket.on('disconnect',()=>{
    const user = userleaves(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage(botname,`${user.username} has left a chat`));
    
};
 //send user and room info
 io.to(user.room).emit('roomuser',{
    room:user.room,
    users:getuserrooms(user.room)
});
});
})
});


const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`)
});



