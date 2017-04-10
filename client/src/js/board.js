import '../stylesheets/app.css';
const ui = require('./ui');
const client = require('./client');
const note = require('./Note');

const NOTE_SIZE = { x: 100, y: 100 };

let name;
let board;
let notes;
let noteElements;

const noteUpdated = (noteData) => {
  const noteToUpdate = notes[noteData.noteID];
  const noteElement = noteElements[noteData.noteID];
  noteToUpdate.text = noteData.text;
  noteElement.childNodes[0].innerHTML = noteData.text;
};

const lerp = (v0, v1, alpha) => {
  return (1 - alpha) * v0 + alpha * v1;
};

const createNote = (posX, posY, text, noteID, creatingNew) => {
  const newNote = note.Note(posX, posY, text, noteID, creatingNew);
  noteElements[noteID] = newNote;
};

const recieveBoard = (noteData) => {
  notes = noteData;
  Object.keys(noteData).forEach((key) => {
    createNote(
      noteData[key].x,
      noteData[key].y,
      noteData[key].text,
      noteData[key].noteID,
      false
    );
  });
};

const setup = (data, roomCode) => {
  name = data;
  console.log(roomCode);
  ui.hideAll(roomCode);
  board.style.display = 'block';
};

const noteAdded = (data) => {
  notes[data.noteID] = data;
  createNote(data.x, data.y, data.text, data.noteID, false);
};

const addNote = (e) => {
  if (e.target.classList.contains('note')) {
    return;
  }

  const posX = e.clientX - NOTE_SIZE.x/2;
  const posY = e.clientY - NOTE_SIZE.y/2;

  const noteID = `${name}${new Date().getTime()}`;
  notes[noteID] = {
    x: posX,
    y: posY,
    prevX: posX,
    prevY: posY,
    destX: posX,
    destY: posY,
    alpha: 0,
    text: '',
    noteID: noteID,
    lastUpdate: new Date().getTime(),
  };
  createNote(posX, posY, '', noteID, true);
  client.emit('addNote', notes[noteID]);
};

const updateNote = (dragData) => {
  const noteUpdate = notes[dragData.noteID];
  const noteDrag = noteElements[dragData.noteID];
  noteUpdate.x = dragData.x;
  noteUpdate.y = dragData.y;
  noteDrag.style.left = `${dragData.x}px`;
  noteDrag.style.top = `${dragData.y}px`;
};

const init = () => {
  board = document.querySelector('#board');
  board.addEventListener('mousedown', note.mouseDown);
  board.addEventListener('mousemove', note.drag);
  board.addEventListener('mouseup', note.mouseUp);
  board.addEventListener('dblclick', addNote);
  notes = {};
  noteElements = {};
};

const getNotes = () => { return notes; };
const getBoard = () => { return board; };

module.exports.init = init;
module.exports.setup = setup;
module.exports.board = getBoard;
module.exports.recieveBoard = recieveBoard;
module.exports.noteAdded = noteAdded;
module.exports.updateNote = updateNote;
module.exports.noteUpdated = noteUpdated;
module.exports.notes = getNotes;
