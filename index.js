// node server which will handel socket io connections
const express = require('express')
var app = express();


const http = require('http')
const server = http.createServer((req, res)=>{
    console.log(req.url);
    url = req.url;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    if(url == '/'){
        res.end(home);
    }
   
});

var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});



// app.get('/', function(req, res) {
//     res.send(home)
// })
const cors = require("cors")
app.use(cors())

const users={};

io.on('connection',socket=>{
    // if any user joined .let other user connected to the server know
    socket.on('new-user-joined',name=>{
        // console.log("new user",name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });
    // if someone send the message , broadcast it to other people
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]});
    });
    // if someone leaves the chat ,let other know
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
})
const fs = require('fs');
const home = fs.readFileSync('index.html')

  
const port = process.env.PORT || 8000
server.listen(port,()=>
{
    console.log("Listening at port => "+port)
});