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
  socket.on('addNote', (data) => { board.addNote(socket, data); });
  socket.on('dragNote', (data) => { board.dragNote(socket, data); });
  socket.on('sendBoard', (data) => { board.recieveBoard(socket, data); });
  socket.on('updateNoteText', (data) => { board.updateNoteText(socket, data); });
  socket.on('collisions', (data) => { board.sendCollisions(socket, data); });
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

const getIO = () => io;

module.exports.init = init;
module.exports.rooms = rooms;
module.exports.io = getIO;
