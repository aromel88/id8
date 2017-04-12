import '../stylesheets/app.css';
const ui = require('./ui');
const client = require('./client');
const note = require('./Note');

const NOTE_SIZE = { x: 100, y: 100 };

let name;
let board;
let notes;
let noteElements;
let initialTip;
let collisions;

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

const draw = () => {
  note.update();
  Object.keys(notes).forEach((key) => {
    const theNote = notes[key];
    if (theNote.alpha < 1) theNote.alpha += 0.05;
    theNote.x = lerp(theNote.prevX, theNote.destX, theNote.alpha);
    theNote.y = lerp(theNote.prevY, theNote.destY, theNote.alpha);
    const noteToDrag = noteElements[key];
    noteToDrag.style.left = `${theNote.x}px`;
    noteToDrag.style.top = `${theNote.y}px`;
    if (noteToDrag.isColliding) {
      noteToDrag.style.backgroundColor = '#4ABDAC';
    } else {
      noteToDrag.style.backgroundColor = 'white';
    }
  });
};

const resolveCollisions = () => {
  if (collisions) {
    Object.keys(collisions).forEach((colA) => {
      const noteA = notes[colA];
      const noteAElement = noteElements[colA];
      let combinedText = notes[colA].text;
      const collisionsWithKey = collisions[colA];
      collisionsWithKey.forEach((colB) => {
        const noteB = notes[colB];
        const noteBElement = noteElements[colB];
        combinedText += " " + noteB.text;
        delete notes[colB];
        noteBElement.innerHTML = '';
        TweenMax.to(noteBElement, 0.3, {
          width: "0px", height: "0px", onComplete: () => {
              noteBElement.parentNode.removeChild(noteBElement)
              delete noteElements[colB];
          }});
      });
      noteAElement.innerHTML = '';
      noteA.text = combinedText;
      TweenMax.to(noteAElement, 0.3, {
        width: "0px", height: "0px", onComplete: () => {
          TweenMax.to(noteAElement, 0.3, { width: "100px", height: "100px",
            onComplete: () => {
              noteAElement.innerHTML = combinedText;
          }});
        }
      });
    });
    collisions = undefined;
    console.dir(notes);
    console.dir(noteElements);
    console.dir(collisions);
  }

};

const updateCollisions = (collisionData) => {
    // update the saved collision data for later, we'll need it on mouse up
    // to know which notes to combine
    collisions = collisionData;
    if (collisions) {
      const collidingKeys = [];
      // grab all the keys that are currently involved in a collision
      Object.keys(collisions).forEach((colA) => {
        collidingKeys.push(colA);
        const collisionsWithKey = collisions[colA];
        collisionsWithKey.forEach((colB) => {
          collidingKeys.push(colB);
        });
      });

      // loop through all the note elements, if their key exist in the collidingKeys
      // mark them as colliding, else mark them note
      Object.keys(noteElements).forEach((key) => {
        if (collidingKeys.indexOf(key) > -1) {
          noteElements[key].isColliding = true;
        } else {
          noteElements[key].isColliding = false;
        }
      });
    }
};

const setup = (data, roomCode) => {
  name = data;
  ui.hideAll(roomCode);
  board.style.display = 'block';
  initialTip.style.display = 'block';
};

const noteAdded = (data) => {
  notes[data.noteID] = data;
  createNote(data.x, data.y, data.text, data.noteID, false);
};

const addNote = (e) => {
  initialTip.style.display = 'none';
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
  //const noteDrag = noteElements[dragData.noteID];
  if (noteUpdate.lastUpdate > dragData.lastUpdate) return;

  noteUpdate.prevX = dragData.prevX;
  noteUpdate.prevY = dragData.prevY;
  noteUpdate.destX = dragData.destX;
  noteUpdate.destY = dragData.destY;
  noteUpdate.alpha = 0.05;
  //noteDrag.style.left = `${dragData.x}px`;
  //noteDrag.style.top = `${dragData.y}px`;
};

const init = () => {
  board = document.querySelector('#board');
  board.addEventListener('mousedown', note.mouseDown);
  board.addEventListener('mousemove', note.drag);
  board.addEventListener('mouseup', () => {
    resolveCollisions();
    note.mouseUp();
    client.emit('resolveCollisions');
  });
  board.addEventListener('dblclick', addNote);
  notes = {};
  noteElements = {};
  //draw();
  setInterval(draw, 30);
  // show initial tip
  initialTip = document.querySelector('.tip');
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
module.exports.updateCollisions = updateCollisions;
module.exports.resolveCollisions = resolveCollisions;
