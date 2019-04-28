// David Feinzimer -> dfeinzimer@csu.fullerton.edu



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
// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyB1D7okzUuAH_V2aVVAGH-IinTjCm0QXWU',
  authDomain: 'ideal-fiesta.firebaseapp.com',
  projectId: 'ideal-fiesta'
});
var db = firebase.firestore();



// Control flow # 2.0
//Generate a public/private key pair
app.post('/genpair', (request, response) => {
  console.log("/genpair");
  var uid = request.body.UID;
  console.log("\tUID: ", uid)
  var pair = keypair();
  console.log("\tPublic: ", pair.public);
  console.log("\tPrivate: ", pair.private);
  setPublicKey(request.body.UID, pair.public)
  response.send(pair);
})



// Control flow # 3.0
//Add public key to a document in collection "users"
function setPublicKey(UID, publicKey) {
  console.log("setPublicKey()");
  console.log("\tUID:", UID);
  console.log("\tpublicKey:", publicKey);
  var userRef = db.collection('users').doc(UID);
  // Set the 'capital' field of the city
  var updateSingle = userRef.update({public_key: publicKey});
}



// Control flow # 4.0 & 5.0
//Encrypt a user's private key
app.post('/submitpin', (request, response) => {
  console.log("/submitpin");
  var pin     = request.body.PIN;
  var private = request.body.PRIVATE;
  var encrypted = aes256.encrypt(pin,private);
  console.log("\tPIN: ", pin);
  console.log("\tPRIVATE: ", private);
  console.log("\tEncrypted Private: ", encrypted);
  response.send(encrypted);
})






// The following is deprecated code.
// It was largely written for initial testing only.
// It remains now for reference purposes only.
// It should be removed before project submission.
//
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
