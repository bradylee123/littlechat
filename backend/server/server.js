const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {isValidString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../../client/public');
const port = process.env.PORT || 5000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected, ID is ' + socket.id);

  socket.on('join', (params, callback) => {
    if (!isValidString(params.username) || !isValidString(params.room)) {
      return callback('Username and room name are required.');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.username, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', `Hello, ${params.username}. Welcome to room ${params.room}.`));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.username} has joined.`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if (user && isValidString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.username, message.text));
    }
    callback();
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.username} has left.`));
    }
  });

});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
