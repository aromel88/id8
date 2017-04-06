
const xxh = require('xxhashjs');
const server = require('./server');

const attemptJoin = (sock, data) => {
  console.log('joinattempt');
  const socket = sock;
  if (!server.rooms[data.roomCode]) {
    socket.emit('err', { msg: 'Incorrect room code' });
    return;
  }

  socket.name = data.userName;
  socket.admin = false;
  socket.roomCode = data.roomCode;
  socket.join(socket.roomCode);
  const room = server.rooms[data.roomCode];
  room.users.push(socket.name);
  socket.emit('joinSuccess', {
    userName: socket.name,
    roomCode: data.roomCode,
    noteData: room.notes,
  });
};

const attemptCreate = (sock, data) => {
  const socket = sock;
  const roomCode = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
  socket.name = data.userName;
  socket.admin = true;
  socket.roomCode = roomCode;
  socket.join(roomCode);
  server.rooms[roomCode] = {
    roomCode: roomCode,
    admin: socket,
    users: [],
    notes: {},
  };
  server.rooms[roomCode].users.push(socket.name);
  socket.emit('createSuccess',
  {
    userName: socket.name,
    roomCode: roomCode,
  });
};

const attemptConnect = (sock, data) => {
  if (data.type === 'join') {
    attemptJoin(sock, data);
  } else {
    attemptCreate(sock, data);
  }
};

module.exports.attemptConnect = attemptConnect;
