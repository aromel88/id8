/*
  client.js
  Module to handle socketIO client functionality

  by Aaron Romel
*/

const ui = require('./ui');
const board = require('./board');
const host = require('./host');

let socket;
let roomCode;

const createSuccess = (data) => {
  roomCode = data.roomCode;
  host.init();
  board.setup(data.userName, roomCode);
  ui.updateUserList(data.userList);
};

const joinSuccess = (data) => {
  roomCode = data.roomCode;
  board.setup(data.userName, roomCode);
  ui.updateUserList(data.userList);
};

// connect socketio server
const connect = (connectData) => {
  // connect to socketio server
  socket = io.connect();
  socket.on('createSuccess', createSuccess);
  socket.on('joinSuccess', joinSuccess);
  socket.on('recieveBoard', board.recieveBoard);
  socket.on('noteAdded', board.noteAdded);
  socket.on('noteDragged', board.updateNote);
  socket.on('noteUpdate', board.noteUpdated);
  socket.on('requestBoard', host.requestBoard);
  socket.on('updateUserList', ui.updateUserList);
  socket.on('updateCollisions', board.updateCollisions);
  socket.on('noCollisions', board.updateCollisions);
  socket.on('resolveCollisions', board.resolveCollisions);

  // attempt connection with websocket server
  socket.emit('attemptConnect', connectData);
};

// allow other modules to emit data to server
const emit = (type, data) => {
  socket.emit(type, data);
};

// disconnect from socket server
const disconnect = () => {
  socket.disconnect();
  socket = undefined;
};

module.exports.connect = connect;
module.exports.emit = emit;
module.exports.disconnect = disconnect;
