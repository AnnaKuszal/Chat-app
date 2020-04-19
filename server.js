const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();


const messages = [];
const users = [];

app.use(express.static(path.join(__dirname + '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('join', (user) => {
    users.push({ name: user, id: socket.id });

    socket.broadcast.emit('newUser', user);
  });

  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    
    let userName = '';
    users.filter(item => {
      if(item.id === socket.id) {
        userName = item.name;
      }

    });
    
    const user = users.filter(item => item.id === socket.id);
    const index = users.indexOf(user);
    users.splice(index, 1);

    socket.broadcast.emit('removeUser', userName);
  });

  console.log('I\'ve added a listener on message event \n');
});