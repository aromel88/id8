import '../stylesheets/app.css';
const ui = require('./ui');
//const client = require('./client');
//const host = require('./host');
const board = require('./board');

const init = () => {
  ui.init();
  board.init();
};

window.addEventListener('load', init);
