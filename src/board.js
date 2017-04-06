
const server = require('./server');

const newNote = (socket, data) => {
  const room = server.rooms[socket.roomCode];
  room.notes[data.noteID] = data;
  socket.broadcast.to(socket.roomCode).emit('addNote', data);
};

module.exports.newNote = newNote;
