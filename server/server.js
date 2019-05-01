/*/////////////////////////////////////////////////////////////////////////////
David Feinzimer -> dfeinzimer@csu.fullerton.edu
/////////////////////////////////////////////////////////////////////////////*/



/*/////////////////////////////////////////////////////////////////////////////
Dependencies and important system variables
/////////////////////////////////////////////////////////////////////////////*/
const cors = require('cors');
const express = require('express')
const firebase = require("firebase")
const hostname = '127.0.0.1';
const http = require('http');
const path = require('path')
const port = 3000
require("firebase/firestore");
var keypair = require('keypair');
var bodyParser = require('body-parser');
var aes256 = require('aes256');



/*/////////////////////////////////////////////////////////////////////////////
Express server creation, setup & startup
/////////////////////////////////////////////////////////////////////////////*/
const app = express()
app.use(bodyParser.json());
app.listen(port, () => console.log(
    `IdealFiesta Chat is running at localhost:${port}`));



/*/////////////////////////////////////////////////////////////////////////////
Firebase setup & connection
/////////////////////////////////////////////////////////////////////////////*/
firebase.initializeApp({
  apiKey: 'AIzaSyB1D7okzUuAH_V2aVVAGH-IinTjCm0QXWU',
  authDomain: 'ideal-fiesta.firebaseapp.com',
  projectId: 'ideal-fiesta'
});
var db = firebase.firestore();



/*/////////////////////////////////////////////////////////////////////////////
Control flow # 2.0
Generate a public/private key pair
/////////////////////////////////////////////////////////////////////////////*/
app.post('/genpair', (request, response) => {
  console.log("/genpair");
  var uid = request.body.UID;
  console.log("\tUID: ", uid);
  var pair = keypair();
  console.log("\tPublic: ", pair.public);
  console.log("\tPrivate: ", pair.private);
  setPublicKey(request.body.UID, pair.public)
  response.send(pair);
});



/*/////////////////////////////////////////////////////////////////////////////
Control flow # 3.0
Add public key to a document in the "users" collection
/////////////////////////////////////////////////////////////////////////////*/
function setPublicKey(UID, publicKey) {
  console.log("setPublicKey()");
  console.log("\tUID:", UID);
  console.log("\tpublicKey:", publicKey);
  var userRef = db.collection('users').doc(UID);
  var updateSingle = userRef.update({public_key: publicKey});
}



/*/////////////////////////////////////////////////////////////////////////////
Control flow # 4.0 & 5.0
Encrypt and return a user's private key
/////////////////////////////////////////////////////////////////////////////*/
app.post('/submitpin', (request, response) => {
  console.log("/submitpin");
  var pin     = request.body.PIN;
  var private = request.body.PRIVATE;
  var encrypted = aes256.encrypt(pin,private);
  console.log("\tPIN: ", pin);
  console.log("\tPRIVATE: ", private);
  console.log("\tEncrypted Private: ", encrypted);
  response.send(encrypted);
});



/*/////////////////////////////////////////////////////////////////////////////
Control flow # 7.0
Mark a user online
/////////////////////////////////////////////////////////////////////////////*/
app.post('/setonline', (request, response) => {
  console.log("/setonline");
  var uid = request.body.UID;
  console.log("\tUID: ", uid);
  var userRef = db.collection('users').doc(uid);
  var updateSingle = userRef.update({status: "online"});
  response.send("OK");
});



/*/////////////////////////////////////////////////////////////////////////////
Control flow # 8.0.b. -> 8.4
Mark a user online
/////////////////////////////////////////////////////////////////////////////*/
app.post('/newconvo', (request, response) => {
  console.log("/newconvo");
  var SenderUID = request.body.SenderUID;
  var ReceiverUID = request.body.ReceiverUID;
  var SenderPrivate = request.body.SenderPrivate;
  var Title = request.body.Title;
  var Msg = request.body.Msg;
  console.log("\tSenderUID:     ", SenderUID);
  console.log("\tReceiverUID:   ", ReceiverUID);
  console.log("\tSenderPrivate: ", SenderPrivate);
  console.log("\tTitle:         ", Title);
  console.log("\tMsg:           ", Msg);
  Msg = Date.now()+Msg;
  console.log("\tModified Msg:  ", Msg);
  var SenderEMsg = aes256.encrypt(SenderPrivate, Msg);
  console.log("\tSenderEMsg:    ", SenderEMsg);
  response.send("OK");
});



/*/////////////////////////////////////////////////////////////////////////////
The following is deprecated code.
Largely written for initial testing only.
Remains now for reference purposes only.
Remove before project submission.
/////////////////////////////////////////////////////////////////////////////*/
/*
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

*/
