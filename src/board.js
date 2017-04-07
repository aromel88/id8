
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

module.exports.addNote = addNote;
module.exports.dragNote = dragNote;
module.exports.updateNoteText = updateNoteText;
module.exports.recieveBoard = recieveBoard;
