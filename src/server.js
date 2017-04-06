/*
  server.js
  main socketio script. initializes socket connection and hooks up
  socket event handlers. All data for app (rooms/users) is kept it memory

  author: Aaron Romel
*/

const socketio = require('socket.io');
const connectionHandler = require('./connection');
const board = require('./board');

let io;
const rooms = {};

const onJoin = (sock) => {
  const socket = sock;
  socket.on('attemptConnect', (data) => {
    connectionHandler.attemptConnect(socket, data);
  });
};

const onMsg = (sock) => {
  const socket = sock;
  socket.on('addNote', (data) => {
    board.newNote(socket, data);
  });
  socket.on('dragNote', (data) => {
    socket.broadcast.to(socket.roomCode).emit('noteDragged', data);
  });
};

const onDisconnect = (sock) => {
  const socket = sock;

  socket.on('disconnect', () => {
    // connectionHandler.handleDisconnect(socket);
  });
};

const init = (expressApp) => {
  io = socketio(expressApp);
  io.sockets.on('connection', (sock) => {
    onJoin(sock);
    onMsg(sock);
    onDisconnect(sock);
  });
  console.log('Websocket server running');
};

module.exports.init = init;
module.exports.rooms = rooms;
