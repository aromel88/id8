
const board = require('./board');
const client = require('./client');

const NOTE_SIZE = { width: 100, height: 100 };
let collisionsExist = false;

const collides = (rect1, rect2) => {
  if (rect1.x < rect2.x + NOTE_SIZE.width &&
      rect1.x + NOTE_SIZE.width > rect2.x &&
      rect1.y < rect2.y + NOTE_SIZE.height &&
      NOTE_SIZE.height + rect1.y > rect2.y) {
    return true;
  }
  return false;
};

const checkCollisions = () => {
  const notes = board.notes();
  const noteKeys = Object.keys(notes);
  const collisions = {};
  for (let i = 0; i < noteKeys.length-1; i+=1) {
    const noteA = notes[noteKeys[i]];
    for (let j = i+1; j < noteKeys.length; j+=1) {
      const noteB = notes[noteKeys[j]];
      if (collides(noteA, noteB)) {
        if (!collisions[`${noteKeys[i]}`]) {
          collisions[`${noteKeys[i]}`] = [];
        }
        collisions[`${noteKeys[i]}`].push(noteKeys[j]);
      }
    }
  }
  if (Object.keys(collisions).length > 0) {
    client.emit('collisions', collisions);
    collisionsExist = true;
  } else if (collisionsExist) {
    collisionsExist = false;
    client.emit('noCollisions');
  }

};

const requestBoard = (data) => {
  client.emit('sendBoard', { toUser: data.userRequesting, notes: board.notes() });
};

const init = () => {
  setInterval(checkCollisions, 20);
};

module.exports.init = init;
module.exports.requestBoard = requestBoard;
