
const client = require('./client');
const board = require('./board');

// DOM elements
let makeButton;
let joinButton;
let connectButton;
let backButton;
let landingScreen;
let landingControls;
let connectControls;

// connection logic variables
let connectionType;

const showConnectControls = () => {
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

const connect = () => {

};

const init = () => {
  // get references to DOM elements and hook up events
  landingScreen = document.querySelector('#landing-screen');
  landingControls = document.querySelector('#landing-controls');
  connectControls = document.querySelector('#connect-controls');

  makeButton = document.querySelector('#make-button');
  makeButton.addEventListener('click', () => {
    showConnectControls();
    connectionType = 'make';
  });
  joinButton = document.querySelector('#join-button');
  joinButton.addEventListener('click', () => {
    showConnectControls();
    connectionType = 'join';
  });
  connectButton = document.querySelector('#connect-button');
  connectButton.addEventListener('click', connect);
  backButton = document.querySelector('#back-button');
  backButton.addEventListener('click', hideConnectControls);
};

module.exports.init = init;
