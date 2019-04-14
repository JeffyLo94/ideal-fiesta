// requires
const express = require('express')
const firebase = require('firebase')
var http = require('http');


// variables
const app = express()
const port = 3000
var provider = new firebase.auth.GoogleAuthProvider();

// Firebase configuration
var config = {
    apiKey: "AIzaSyB1D7okzUuAH_V2aVVAGH-IinTjCm0QXWU",
    authDomain: "ideal-fiesta.firebaseapp.com",
    databaseURL: "https://ideal-fiesta.firebaseio.com",
    projectId: "ideal-fiesta",
    storageBucket: "ideal-fiesta.appspot.com",
    messagingSenderId: "344869506367"
};

firebase.initializeApp(config);
