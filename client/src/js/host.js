
const board = require('./board');
const client = require('./client');

const requestBoard = (data) => {
  client.emit('sendBoard', { toUser: data.userRequesting, notes: board.notes() });
};

const init = () => {

};

module.exports.init = init;
module.exports.requestBoard = requestBoard;
