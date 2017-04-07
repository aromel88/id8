import '../stylesheets/app.css';
const ui = require('./ui');
const client = require('./client');

const NOTE_SIZE = { x: 100, y: 100 };

let name;
let board;
let notes;
let noteElements;
let dragging = false;
let currentNote;

const mouseDown = (e) => {
  e.preventDefault();
  e.stopPropagation();
  // only drag notes, please
  if (!e.target.classList.contains('note')) return;
  currentNote = e.target;
  dragging = true;
  TweenMax.to(currentNote, 0, {
    left: e.clientX - currentNote.offsetWidth/2,
    top: e.clientY - currentNote.offsetHeight/2
  });
};

const mouseUp = (e) => {
  dragging = false;
  currentNote = undefined;
};

const noteDragged = (dragData) => {
  const noteToDrag = noteElements[dragData.noteID];
  const noteToUpdate = notes[dragData.noteID];
  noteToDrag.style.left = `${dragData.x}px`;
  noteToDrag.style.top = `${dragData.y}px`;
  noteToUpdate.x = dragData.x;
  noteToUpdate.y = dragData.y;
};

const drag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  // only drag notes
  if (!dragging || !currentNote) return;

  const xDrag = e.clientX - currentNote.offsetWidth/2;
  const yDrag = e.clientY - currentNote.offsetHeight/2;
  currentNote.style.left = `${xDrag}px`;
  currentNote.style.top = `${yDrag}px`;

  client.emit('dragNote', { noteID: currentNote.noteID,  x: xDrag, y: yDrag });
};

const createNote = (posX, posY, text, noteID) => {
  const newNote = document.createElement('div');
  newNote.noteID = noteID;
  newNote.classList.add('note');
  newNote.style.left = `${posX}px`;
  newNote.style.top = `${posY}px`;
  const noteText = document.createElement('p');
  newNote.appendChild(noteText);
  board.appendChild(newNote);
  noteElements[noteID] = newNote;
};

const recieveBoard = (noteData) => {
  notes = noteData;
  Object.keys(noteData).forEach((key) => {
    createNote(
      noteData[key].x,
      noteData[key].y,
      noteData[key].text,
      noteData[key].noteID
    );
  });
};

const setup = (data) => {
  name = data;
  ui.hideAll();
  board.style.display = 'block';
};

const noteAdded = (data) => {
  notes[data.noteID] = data;
  createNote(data.x, data.y, data.text, data.noteID);
};

const addNote = (e) => {
  const posX = e.clientX - NOTE_SIZE.x/2;
  const posY = e.clientY - NOTE_SIZE.y/2;

  const noteID = `${name}${new Date().getTime()}`;
  notes[noteID] = {
    x: posX,
    y: posY,
    text: '',
    noteID: noteID,
  };
  createNote(posX, posY, '', noteID);
  client.emit('addNote', notes[noteID]);
};

const init = () => {
  board = document.querySelector('#board');
  board.addEventListener('mousedown', mouseDown);
  board.addEventListener('mousemove', drag);
  board.addEventListener('mouseup', mouseUp);
  board.addEventListener('dblclick', addNote);
  notes = {};
  noteElements = {};
};

const getNotes = () => { return notes; };

module.exports.init = init;
module.exports.setup = setup;
module.exports.recieveBoard = recieveBoard;
module.exports.noteAdded = noteAdded;
module.exports.noteDragged = noteDragged;
module.exports.notes = getNotes;
