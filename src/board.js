
const server = require('./server');

const addNote = (sock, data) => {
  const socket = sock;
  server.rooms[socket.roomCode].notes[data.noteID] = data;
  socket.broadcast.to(socket.roomCode).emit('noteAdded', data);
};

const dragNote = (sock, data) => {
  const socket = sock;
  const note = server.rooms[socket.roomCode].notes[data.noteID];
  note.x = data.x;
  note.y = data.y;
  socket.broadcast.to(socket.roomCode).emit('noteDragged', data);
};

module.exports.addNote = addNote;
module.exports.dragNote = dragNote;
