import '../stylesheets/app.css';

let board;
let notes = {};

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

const init = () => {
  board = document.querySelector('#board');
  board.addEventListener('mousedown', mouseDown);
  board.addEventListener('mousemove', drag);
  board.addEventListener('mouseup', mouseUp);
};

module.exports.init = init;
