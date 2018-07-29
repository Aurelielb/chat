const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8081);

io.origins((origin, callback) => {
    // if (origin !== 'https://chat.example.com') {
    //     return callback('origin not allowed', false);
    // }
    // authorize everything : to update as soon as final URL is known
    callback(null, true);
});

const users = {};
io.on('connection', (socket) => {
    let currentUser;
    socket.on('join', (userName) => {
        // todo add more datas about user later
        users[userName] = {id: socket.id};
        currentUser = userName;
        io.emit('userlist', users);
        io.to(users[userName].id).emit('message', {
            message: `Bienvenue sur le chat !`
        });
        socket.broadcast.emit('message', {
            message: `${userName} a rejoint le chat`
        });
    });

    socket.on('message', (message) => {
        socket.broadcast.emit('message', {
            nickname: currentUser,
            message: message
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('message', {
            message: `${currentUser} a quitté le chat`
        });
        delete (users[currentUser]);
        io.emit('userlist', users);
    });
});