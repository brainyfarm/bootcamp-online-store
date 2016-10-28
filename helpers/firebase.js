/* Require and set up firebase */
var firebase = require('firebase');
var config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  storageBucket: process.env.storageBucket
};

firebase.initializeApp(config);

module.exports = firebase;
