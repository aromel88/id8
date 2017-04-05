/*
  client.js
  Module to handle socketIO client functionality

  by Aaron Romel
*/

const board = require('./board');
const host = require('./host');

let socket;
let roomCode;

const createSuccess = (data) => {
  roomCode = data.roomCode;
  host.init();
  board.setup();
};

const joinSuccess = (data) => {
  roomCode = data.roomCode;
  board.setup(data.notes);
};

// connect socketio server
const connect = (connectData) => {
  // connect to socketio server
  socket = io.connect();
  socket.on('createSuccess', createSuccess);
  socket.on('joinSucceess', joinSuccess);

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
