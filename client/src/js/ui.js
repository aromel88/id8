
const client = require('./client');
const board = require('./board');

// DOM elements
let landingScreen;
let roomCodeDisplay;
let landingControls;
let connectControls;
let roomInput;
let nameInput;
let sidebar;
let sidebarBreak;
let menuButtonIcon;
let copyRoomCodeInput;
let userList;
let roomCode;

// connection logic variables
let connectionType;
let menuActive = true;

const showConnectControls = (type) => {
  if (type === 'join') {
    roomInput.style.display = 'block';
  } else {
    roomInput.style.display = 'none';
  }
  TweenMax.to(landingControls, 0.3, { opacity: 0, onComplete: () => {
    landingControls.style.display = 'none';
    connectControls.style.display = 'block';
    TweenMax.to(connectControls, 0.3, { opacity: 1, delay: 0.2 });
    TweenMax.to(landingScreen, 0.5, { height: '600px'});
  }});
};

const hideConnectControls = () => {
  TweenMax.to(connectControls, 0.2, { opacity: 0, onComplete: () => {
    connectControls.style.display = 'none';
    landingControls.style.display = 'block';
    TweenMax.to(landingControls, 0.3, { opacity: 1, delay: 0.2 });
    TweenMax.to(landingScreen, 0.5, { height: '400px'});
  }});
};

const showRoomCode = (room) => {
  TweenMax.to(landingScreen, 0.4, { left: "-250px" });
  TweenMax.to(roomCodeDisplay, 0.4, { left: "50%" });
  roomCode = room;
  const displayCodeInput = document.querySelector('#display-code');
  displayCodeInput.style.textAlign = 'center';
  displayCodeInput.value = room;
};

const showBoard = () => {
  const body = document.querySelector('body');
  board.show();
  setTimeout(() => { if (menuActive) showMenu(); }, 3000);

  copyRoomCodeInput.value = roomCode;
  TweenMax.to(roomCodeDisplay, 0.5, {
    opacity: 0,
    onComplete: () => {
      roomCodeDisplay.style.display = 'none';
      landingScreen.style.display = 'none';
      body.style.overflowX = 'auto';
    }
  });
  sidebar.style.display = 'block';
  TweenMax.to(body, 0.5, { backgroundColor: "#F5F5F5" });
  TweenMax.to(sidebar, 0.5, { opacity: 1 });
};

const showMenu = () => {
  menuActive = !menuActive;
  if (menuActive) {
    TweenMax.to(sidebar, 0.3, { left: '0px' });
    TweenMax.to(menuButtonIcon, 0.3, { rotation: 180 });
  } else {
    TweenMax.to(menuButtonIcon, 0.3, { rotation: 0 });
    TweenMax.to(sidebar, 0.3, { left: '-300px' });
  }
};

const connect = () => {
  const connectData = {
    type: connectionType,
    userName: nameInput.value,
    roomCode: roomInput.value,
  };

  client.connect(connectData);
};

const updateUserList = (data) => {
  userList.innerHTML = '<h1>Users</h1>';
  data.forEach((user) => {
    let userElem = document.createElement('li');
    userElem.classList.add('user');
    userElem.innerHTML = `<p>${user}</p>`;
    userList.appendChild(userElem);
  });
};

const init = () => {
  // get references to DOM elements and hook up events
  landingScreen = document.querySelector('#landing-screen');
  landingControls = document.querySelector('#landing-controls');
  connectControls = document.querySelector('#connect-controls');
  sidebar = document.querySelector('#sidebar');
  sidebarBreak = document.querySelector('#sidebar-break');

  const makeButton = document.querySelector('#make-button');
  makeButton.addEventListener('click', () => {
    showConnectControls('make');
    connectionType = 'make';
  });
  const joinButton = document.querySelector('#join-button');
  joinButton.addEventListener('click', () => {
    showConnectControls('join');
    connectionType = 'join';
  });

  roomCodeDisplay = document.querySelector('#room-code-display');
  const goButton = document.querySelector('#go-button');
  goButton.addEventListener('click', showBoard);

  const connectButton = document.querySelector('#connect-button');
  connectButton.addEventListener('click', connect);
  const backButton = document.querySelector('#back-button');
  backButton.addEventListener('click', hideConnectControls);
  const menuButton = document.querySelector('#menu-button');
  menuButton.addEventListener('click', showMenu);

  menuButtonIcon = menuButton.childNodes[0];
  menuButtonIcon.style.transform = 'rotate(180deg)';
  copyRoomCodeInput = document.querySelector('#copy-room-code');
  userList = document.querySelector('#user-list');

  roomInput = document.querySelector('#room-input');
  nameInput = document.querySelector('#name-input');
};

module.exports.init = init;
module.exports.showRoomCode = showRoomCode;
module.exports.updateUserList = updateUserList;
