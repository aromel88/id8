import '../stylesheets/app.css';
const ui = require('./ui');

const NOTE_SIZE = { x: 100, y: 100 };

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

const setup = (noteData) => {
  ui.hideAll();
  board.style.display = 'block';
  if (noteData) {
    // setup notes
  } else {

  }
};

const addNote = (e) => {
  console.log(e);
  const posX = e.clientX - NOTE_SIZE.x/2;
  const posY = e.clientY - NOTE_SIZE.y/2;

  notes.push({
    x: posX,
    y: posY,
    text: '',
    index: notes.length,
  });
  const newNote = document.createElement('div');
  newNote.classList.add('note');
  newNote.style.left = `${posX}px`;
  newNote.style.top = `${posY}px`;
  const noteText = document.createElement('p');
  noteText.classList.add('note-text');
  newNote.appendChild(noteText);
  board.appendChild(newNote);
};

const init = () => {
  board = document.querySelector('#board');
  board.addEventListener('mousedown', mouseDown);
  board.addEventListener('mousemove', drag);
  board.addEventListener('mouseup', mouseUp);
  board.addEventListener('dblclick', addNote);
  notes = [];
};

module.exports.init = init;
module.exports.setup = setup;
module.exports.notes = notes;
