
const client = require('./client');
const board = require('./board');

// DOM elements
let landingScreen;
let landingControls;
let connectControls;
let makeButton;
let joinButton;
let connectButton;
let backButton;
let roomInput;
let nameInput;
let sidebar;
let sidebarBreak;
let menuButton;

// connection logic variables
let connectionType;
let menuActive = false;

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

const hideAll = () => {
  TweenMax.to(landingScreen, 0.5, {
    opacity: 0,
    onComplete: () => {
      landingScreen.style.display = 'none';
    }
  });
  sidebar.style.display = 'block';
  TweenMax.to(document.querySelector('body'), 0.5, { backgroundColor: "#F7B733" });
  TweenMax.to(sidebar, 0.5, { opacity: 1 });
};

const showMenu = () => {
  menuActive = !menuActive;
  if (menuActive) {
    TweenMax.to(sidebar, 0.3, { left: '0px' });
    TweenMax.to(sidebarBreak, 0.03, { left: '200px' });
  } else {
    TweenMax.to(sidebarBreak, 3.0, { left: '0px' });
    TweenMax.to(sidebar, 0.3, { left: '-200px' });
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
  console.dir(data);
};

const init = () => {
  // get references to DOM elements and hook up events
  landingScreen = document.querySelector('#landing-screen');
  landingControls = document.querySelector('#landing-controls');
  connectControls = document.querySelector('#connect-controls');
  sidebar = document.querySelector('#sidebar');
  sidebarBreak = document.querySelector('#sidebar-break');

  makeButton = document.querySelector('#make-button');
  makeButton.addEventListener('click', () => {
    showConnectControls('make');
    connectionType = 'make';
  });
  joinButton = document.querySelector('#join-button');
  joinButton.addEventListener('click', () => {
    showConnectControls('join');
    connectionType = 'join';
  });
  connectButton = document.querySelector('#connect-button');
  connectButton.addEventListener('click', connect);
  backButton = document.querySelector('#back-button');
  backButton.addEventListener('click', hideConnectControls);
  menuButton = document.querySelector('#menu-icon');
  menuButton.addEventListener('click', showMenu);

  roomInput = document.querySelector('#room-input');
  nameInput = document.querySelector('#name-input');
};

module.exports.init = init;
module.exports.hideAll = hideAll;
module.exports.updateUserList = updateUserList;
