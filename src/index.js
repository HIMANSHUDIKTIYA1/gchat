require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');

const PORT =process.env.PORT ;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Server is running');
});

const io = socketIo(server, {
    cors: {
        origin: "*"
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
