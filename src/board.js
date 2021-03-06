
const server = require('./server');

const addNote = (socket, data) => {
  socket.broadcast.to(socket.roomCode).emit('noteAdded', data);
};

const dragNote = (socket, data) => {
  socket.broadcast.to(socket.roomCode).emit('noteDragged', data);
};

const recieveBoard = (socket, data) => {
  const room = server.rooms[socket.roomCode];
  room.users[data.toUser].emit('recieveBoard', data.notes);
};

const updateNoteText = (socket, data) => {
  socket.broadcast.to(socket.roomCode).emit('noteUpdate', data);
};

const sendCollisions = (socket, data) => {
  server.io().sockets.in(socket.roomCode).emit('updateCollisions', data);
};

const noCollisions = (socket) => {
  server.io().sockets.in(socket.roomCode).emit('updateCollisions', []);
};

module.exports.addNote = addNote;
module.exports.dragNote = dragNote;
module.exports.updateNoteText = updateNoteText;
module.exports.recieveBoard = recieveBoard;
module.exports.sendCollisions = sendCollisions;
module.exports.noCollisions = noCollisions;
