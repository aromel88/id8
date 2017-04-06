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

const drag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  // only drag notes
  if (!dragging || !currentNote) return;

  currentNote.style.left = `${e.clientX - currentNote.offsetWidth/2}px`;
  currentNote.style.top = `${e.clientY - currentNote.offsetHeight/2}px`;
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

const setup = (userName, noteData) => {
  name = userName;
  ui.hideAll();
  board.style.display = 'block';
  if (noteData) {
    notes = noteData;
    Object.keys(noteData).forEach((key) => {
      createNote(
        noteData[key].x,
        noteData[key].y,
        noteData[key].text,
        noteData[key].noteID
      );
    });
  } else {
    // there are no notes, make element show totell how to make notes
  }
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

module.exports.init = init;
module.exports.setup = setup;
module.exports.notes = notes;
