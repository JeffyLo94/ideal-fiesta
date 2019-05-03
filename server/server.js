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
Anytime a coversation is created add its id to the creator and participants
/////////////////////////////////////////////////////////////////////////////*/
function AddConversationToUser(conversation_id,creator_uid,participant_uid) {
    var fName = "AddConversationToUser()";
    console.log(fName,"-> conversation_id:",conversation_id);
    console.log(fName,"-> creator_uid:",creator_uid);
    console.log(fName,"-> participant_uid:",participant_uid);
    var existing_convo_id_list = [];
    db.collection('users').doc(creator_uid).get()
    .then(function(doc, existing_convo_id_list) {
        existing_convo_id_list = doc.data().convo_id_list;
        existing_convo_id_list.push(conversation_id);
        var Ref = db.collection('users').doc(creator_uid);
        Ref.update({convo_id_list: existing_convo_id_list});
    })
    .catch(function(error) {
        console.error("\tError adding conversation to creator: ", error);
    });;
}



/*/////////////////////////////////////////////////////////////////////////////
Anytime a message is sent, add its id to the conversation it belongs to
/////////////////////////////////////////////////////////////////////////////*/
function AddMessageToConversation(message_id, conversation_id) {
    console.log("AddMessageToConversation()");
    console.log("\tmessage_id:",message_id);
    console.log("\tconversation_id:",conversation_id);
    var existing_message_id_list = [];
    db.collection('conversations').doc(conversation_id).get()
    .then(function(doc, existing_message_id_list) {
        existing_message_id_list = doc.data().message_id_list;
        existing_message_id_list.push(message_id);
        var convoRef = db.collection('conversations').doc(conversation_id);
        convoRef.update({message_id_list: existing_message_id_list});
    })
    .catch(function(error) {
        console.error("\tError adding message to conversation: ", error);
    });;
}



/*/////////////////////////////////////////////////////////////////////////////
Send a message
/////////////////////////////////////////////////////////////////////////////*/
function sendMessage(SenderEEMsg, creation_time, ReceiverUID, SenderUID, conversation_id) {
  console.log("sendMessage()");
  //console.log("\tSenderEEMsg:", SenderEEMsg);
  console.log("\tcreation_time: ", creation_time);
  console.log("\tconversation_id: ", conversation_id);
  console.log("\treceiver_uid:  ", ReceiverUID);
  console.log("\tsender_uid:    ", SenderUID);
  // Create a place to store the message id after it has been created
  var message_id;
  // Post the message
  db.collection("messages").add({
      sender_ee_msg: SenderEEMsg,
      creation_time: creation_time,
      receiver_uid: ReceiverUID,
      sender_uid: SenderUID,
      receiver_read: false
  })
  .then(function(docRef) {
      message_id = docRef.id;
      console.log("\tMessage posted. ID: ", message_id);
      // Add the new message's id into the conversation it belongs to
      AddMessageToConversation(message_id,conversation_id);
  })
  .catch(function(error) {
      console.error("\tError posting message: ", error);
  });
  return message_id;
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
Starting a new conversation
/////////////////////////////////////////////////////////////////////////////*/
app.post('/newconvo', (request, response) => {
  console.log("/newconvo");

  // Unpackage and document the request
  var SenderUID = request.body.SenderUID;
  var ReceiverUID = request.body.ReceiverUID;
  var SenderPrivate = request.body.SenderPrivate;
  var Title = request.body.Title;
  var Msg = request.body.Msg;
  console.log("\tsender_uid:   ", SenderUID);
  //console.log("\tReceiverUID:   ", ReceiverUID);
  //console.log("\tSenderPrivate: ", SenderPrivate);
  console.log("\ttitle:        ", Title);
  console.log("\tmsg:          ", Msg);

  var creation_time = Date.now();

  var convoID;
  // Make a new conversation object
  db.collection("conversations").add({
      title: Title,
      receiver_uid_list: ReceiverUID,
      creator_uid: SenderUID,
      creation_time: creation_time,
      message_id_list:[],
  })
  // Upon creation, perform encryption and post the first message.
  .then(function(docRef) {
      convoID = docRef.id;
      console.log("\tConversation posted with ID: ", convoID);

      // Perform first encryption layer
      Msg = creation_time + Msg;
      var SenderEMsg = aes256.encrypt(SenderPrivate, Msg);

      // Gather the public keys of every user in the conversation
      for(var i = 0; i < ReceiverUID.length; i++) {
        //var receiver_uid = ReceiverUID[i];
        console.log("\treceiver_uid: ",ReceiverUID[i]);
        db.collection('users').doc(ReceiverUID[i]).get().then(function(doc) {
          //console.log("\tsender_public_key: ",doc.data().public_key);

          var pin = doc.data().public_key;
          var private = SenderEMsg;
          var SenderEEMsg = aes256.encrypt(pin, private);

          //console.log("\tsender_ee_msg:",SenderEEMsg);

          var receiver = doc.id;

          sendMessage(SenderEEMsg,creation_time,receiver,SenderUID,convoID);
        });
      }
  })
  .catch(function(error) {
      console.error("Error posting message: ", error);
  });
  response.send(convoID);
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
