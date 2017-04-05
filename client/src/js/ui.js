
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

// connection logic variables
let connectionType;

const showConnectControls = (type) => {
  if (type === 'join') {
    roomInput.style.display = 'block';
  } else {
    roomInput.style.display = 'none';
  }
  TweenMax.to(landingControls, 0.3, { opacity: 0, onComplete: () => {
    landingControls.style.display = 'none';
  }});
  connectControls.style.display = 'block';
  TweenMax.to(connectControls, 0.3, { opacity: 1, delay: 0.2 });
  TweenMax.to(landingScreen, 0.5, { height: '400px'});
};

const hideConnectControls = () => {
  TweenMax.to(connectControls, 0.3, { opacity: 0, onComplete: () => {
    connectControls.style.display = 'none';
  }});
  landingControls.style.display = 'block';
  TweenMax.to(landingControls, 0.3, { opacity: 1, delay: 0.2 });
  TweenMax.to(landingScreen, 0.5, { height: '300px'});
};

const hideAll = () => {
  TweenMax.to(landingScreen, 0.5, {
    opacity: 0,
    onComplete: () => {
      landingScreen.style.display = 'none';
    }
  });
  TweenMax.to(document.querySelector('body'), 0.5, { backgroundColor: "#3F51B5" });
};

const connect = () => {
  const connectData = {
    type: connectionType,
    userName: nameInput.value,
    roomCode: roomInput.value,
  };

  client.connect(connectData);
};

const init = () => {
  // get references to DOM elements and hook up events
  landingScreen = document.querySelector('#landing-screen');
  landingControls = document.querySelector('#landing-controls');
  connectControls = document.querySelector('#connect-controls');

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

  roomInput = document.querySelector('#room-input');
  nameInput = document.querySelector('#name-input');
};

module.exports.init = init;
module.exports.hideAll = hideAll;
