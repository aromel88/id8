
const xxh = require('xxhashjs');
const server = require('./server');

const attemptJoin = (sock, data) => {
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
  room.users[socket.name] = socket;
  room.userList.push(socket.name);
  socket.emit('joinSuccess', {
    userName: socket.name,
    roomCode: data.roomCode,
    userList: room.userList,
  });
  socket.broadcast.to(socket.roomCode).emit('updateUserList', room.userList);
  room.admin.emit('requestBoard', { userRequesting: socket.name });
};

const attemptCreate = (sock, data) => {
  const socket = sock;
  const roomCode = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
  socket.name = data.userName;
  socket.admin = true;
  socket.roomCode = roomCode;
  socket.join(roomCode);
  server.rooms[roomCode] = {
    roomCode,
    admin: socket,
    users: {},
    userList: [],
  };
  server.rooms[roomCode].users[socket.name] = socket;
  server.rooms[roomCode].userList.push(socket.name);
  socket.emit('createSuccess',
    {
      userName: socket.name,
      roomCode,
      userList: [socket.name],
    });
};

const attemptConnect = (sock, data) => {
  if (data.type === 'join') {
    attemptJoin(sock, data);
  } else {
    attemptCreate(sock, data);
  }
};

const handleDisconnect = (sock) => {
  const socket = sock;
  if (socket.admin) {
    socket.broadcast.to(socket.roomCode).emit('adminDisconnect');
  } else {
    const room = server.rooms[socket.roomCode];
    const user = socket.name;
    room.userList.splice(room.userList.indexOf(user), 1);
    socket.broadcast.to(socket.roomCode).emit('updateUserList', room.userList);
  }
};

module.exports.attemptConnect = attemptConnect;
module.exports.handleDisconnect = handleDisconnect;
