const cors = require('cors');
const express = require('express')
const firebase = require("firebase")
const http = require('http');
const path = require('path')

var keypair = require('keypair');
var bodyParser = require('body-parser')

const hostname = '127.0.0.1';
const app = express()
const port = 3000

require("firebase/firestore"); // Required for side-effects

app.use(bodyParser.json());

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyB1D7okzUuAH_V2aVVAGH-IinTjCm0QXWU',
  authDomain: 'ideal-fiesta.firebaseapp.com',
  projectId: 'ideal-fiesta'
});

var db = firebase.firestore();

app.listen(port, () => console.log(`IdealFiesta Chat is running at localhost:${port}`))

// Listen for homepage requests
app.get('/', (request, response) => {

  // Log all messages in the database
  logAllMessages()

  // Send the user to our homepage
  response.sendFile(path.join(__dirname+'/html/home.html'))
})

// Listen for new messages to be sent
app.get('/send', (request, response) => {
  // Log the information about the message to be sent
  console.log(request.query.to)
  console.log(request.query.message)

  // Send the message
  sendMessage(
    request.query.to,
    request.query.message
  )

  // Send the user back home
  response.sendFile(path.join(__dirname+'/html/home.html'))
})

// 2.0 Generate a public/private key pair
app.post('/genpair', (request, response) => {
  console.log("/genpair");
  var uid = request.body.UID;
  console.log("\tUID: ", uid)
  var pair = keypair();
  console.log("\tPublic: ", pair.public);
  console.log("\tPrivate: ", pair.private);
  response.send(pair);
})

// 3.0 Add public key to a document in collection "users"
function setPublicKey() {

}

function sendMessage(to,message) {
  db.collection("messages").add({
      To: to,
      Message: message,
      Read: false
  })
  .then(function(docRef) {
      console.log("Message posted with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error posting message: ", error);
  });

  // Log all messages in the database
  logAllMessages()
}

// Log all messages in our database
function logAllMessages() {
  console.log(`All system messages:`)
  db.collection("messages").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(`\tMessage ID: ${doc.id}`);
          console.log(`\t\tTo: ${doc.data().To}`);
          console.log(`\t\tMessage: ${doc.data().Message}`);
          console.log(`\t\tRead: ${doc.data().Read}`);
      });
  });
}
