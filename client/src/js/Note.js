
const client = require('./client');
const board = require('./board');

let noStick = false;
let typing = false;
let dragging = false;
let currentNote;
let deleteButton;
let dragCount = 0; // allows limiting emits to every x drag events

const stickNote = () => {
  const text = currentNote.childNodes[0];
  const textBox = currentNote.childNodes[1];
  const textValue = textBox.value;
  text.innerHTML = textValue;
  textBox.style.display = 'none';
  text.style.display = 'block';
  typing = false;
  board.notes()[currentNote.noteID].text = textValue;
  client.emit('updateNoteText', {
    noteID: currentNote.noteID,
    text: textValue,
  });
};

const setNoteHeight = (e) => {
  //console.dir(e.target);
};


const mouseDown = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (typing) {
    stickNote();
  }
  if (e.target.classList.contains('note')) {
    currentNote = e.target;
    dragging = true;
  }
};

const update = () => {
  console.dir(currentNote);
  if (currentNote) {
    const theNote = board.notes()[currentNote.noteID];
    theNote.prevX = theNote.x;
    theNote.prevY = theNote.y;
  }
};

const drag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  // only drag notes
  if (!dragging || !currentNote) return;
  if (dragCount <= 10) {
    dragCount += 1;
    const xDrag = e.clientX - currentNote.offsetWidth/2;
    const yDrag = e.clientY - currentNote.offsetHeight/2;
    const theNote = board.notes()[currentNote.noteID];
    const dragData = {
      noteID: currentNote.noteID,
      prevX: theNote.prevX,
      prevY: theNote.prevY,
      destX: xDrag,
      destY: yDrag,
      lastUpdate: new Date().getTime(),
    };
    board.updateNote(dragData);
    client.emit('dragNote', dragData);
  } else {
    dragCount = 0;
  }
};

const mouseUp = (e) => {
  dragging = false;
  currentNote = undefined;
  dragCount = 0;
};

const editNote = (e) => {
  currentNote = e.target;
  const text = currentNote.childNodes[0];
  const textBox = currentNote.childNodes[1];
  const textValue = text.innerHTML;
  textBox.value = textValue;
  text.style.display = 'none';
  textBox.style.display = 'block';
  typing = true;
  dragging = false;
  textBox.focus();
};

const allowDelete = (e) => {
  deleteButton.style.display = 'block';
};

const setupTextBox = () => {
  const noteTextBox = document.createElement('textarea');
  noteTextBox.addEventListener('input', setNoteHeight);
  noteTextBox.addEventListener('focusout', () => {
    currentNote = undefined;
  });
  noteTextBox.addEventListener('keyup', (e) => {
    if (e.keyCode === 16) {
      noStick = false;
    }
  });
  noteTextBox.addEventListener('keydown', (e) => {
    if (e.keyCode === 16) {
      noStick = true;
    } else if (e.keyCode === 13 && !noStick) {
      console.log('stick');
      stickNote();
    }
  });
  noteTextBox.rows = 4;
  noteTextBox.cols = 9;

  return noteTextBox;
};

const Note = (posX, posY, text, noteID, creatingNew) => {
  const newNote = document.createElement('div');
  newNote.noteID = noteID;
  newNote.classList.add('note');
  newNote.style.left = `${posX}px`;
  newNote.style.top = `${posY}px`;
  newNote.addEventListener('dblclick', editNote);
  //newNote.addEventListener('mouseover', allowDelete);

  // deleteButton = document.createElement('div');
  // deleteButton.classList.add('note-delete-button');
  // deleteButton.innerHTML = 'x';
  // newNote.appendChild(deleteButton);

  const noteText = document.createElement('p');
  const noteTextBox = setupTextBox();
  newNote.appendChild(noteText);
  newNote.appendChild(noteTextBox);
  board.board().appendChild(newNote);
  if (creatingNew) {
    noteText.style.display = 'none';
    typing = true;
    noteTextBox.focus();
    currentNote = newNote;
  } else {
    noteTextBox.style.display = 'none';
    noteText.innerHTML = 'text';
  }

  return newNote;
}

const setCurrentNote = (note) => { currentNote = note; };
const getCurrentNote = () => { return currentNote; };

module.exports.Note = Note;
module.exports.mouseDown = mouseDown;
module.exports.drag = drag;
module.exports.update = update;
module.exports.mouseUp = mouseUp;
module.exports.setCurrentNote = setCurrentNote;
module.exports.currentNote = getCurrentNote;
