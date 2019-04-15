const cors = require('cors');
const express = require('express')
const firebase = require("firebase")
const http = require('http');
const path = require('path')

const hostname = '127.0.0.1';
const app = express()
const port = 3000

require("firebase/firestore"); // Required for side-effects

app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/html/home.html')))

app.get('/send', (req, res) => res.sendFile(path.join(__dirname+'/html/send.html')))

app.listen(port, () => console.log(`IdealFiesta listening on port ${port}!`))

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyB1D7okzUuAH_V2aVVAGH-IinTjCm0QXWU',
  authDomain: 'ideal-fiesta.firebaseapp.com',
  projectId: 'ideal-fiesta'
});

var db = firebase.firestore();

/*
db.collection("users").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

// Add a second document with a generated ID.
db.collection("users").add({
    first: "Alan",
    middle: "Mathison",
    last: "Turing",
    born: 1912
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});
*/

db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
