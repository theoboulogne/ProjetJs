const port = 8080;

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io =  require('socket.io')(server);

const testModule = require('./server_modules/test');
const classModule = require('./server_modules/Class');

app.use(express.static(__dirname + '/assets/'));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/index.html')
});

app.get('/second', (req, res, next) => {
    let test = new classModule();
    res.sendFile(__dirname + '/assets/views/second.html')
});

io.sockets.on('connection',  (socket) =>{
    io.emit('hello', 'A new connection on our website');
    socket.emit('hello', 'Hello to you');
    socket.on('message', (from, msg)=> {
        console.log('Irecived a message by' + from + 'telling' + msg)
    });

    socket.on('disconnect', ()=>{
        console.log('Disconnect');
    });
});

server.listen(port);
console.log('server connected');