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
    var func_name = "/genpair ->";
    var uid = request.body.UID;
    console.log("\tUID: ", uid);
    var pair = keypair();
    console.log(func_name,"Public:", pair.public);
    console.log(func_name,"Private:", pair.private);
    setPublicKey(request.body.UID, pair.public)
    response.send(pair);
});



/*/////////////////////////////////////////////////////////////////////////////
Retrieve the list of conversation ids a given user belongs to.
/////////////////////////////////////////////////////////////////////////////*/
app.post('/getconvos', (request, response) => {
    var func_name = "/getconvos ->"
    var user_id = request.body.UID;
    var conversations = [];
    db.collection('users').doc(user_id).get()
    .then(function(doc) {
        conversations = doc.data().conversations;
        response.send(conversations);
    })
    .catch(function(error) {
        console.error(func_name,"ERROR:",error);
    });;
});



/*/////////////////////////////////////////////////////////////////////////////
Retrieve a message and perform decryption twice.
/////////////////////////////////////////////////////////////////////////////*/
app.post('/getmsg', (request, response) => {
    var func_name = "/getmsg ->"
    var message_id = request.body.message_id;
    /*
    db.collection('users').doc(user_id).get()
    .then(function(doc) {
        conversations = doc.data().conversations;
        response.send(conversations);
    })
    .catch(function(error) {
        console.error(func_name,"ERROR:",error);
    });;
    */
});



/*/////////////////////////////////////////////////////////////////////////////
Control flow # 8.0.b. -> 8.4
Starting a new conversation
/////////////////////////////////////////////////////////////////////////////*/
app.post('/newconvo', (request, response) => {
    var func_name = "/newconvo";
    // Unpackage and document the request /////////////////////////////////////
    var SenderUID = request.body.SenderUID;
    var ReceiverUID = request.body.ReceiverUID;
    var SenderPrivate = request.body.SenderPrivate;
    var Title = request.body.Title;
    var Msg = request.body.Msg;
    console.log(func_name,"-> sender_uid:", SenderUID);
    console.log(func_name,"-> title:", Title);
    console.log(func_name,"-> msg:", Msg);
    var creation_time = Date.now();
    var convoID;
    db.collection("conversations").add({
        // Make a new conversation object /////////////////////////////////////
        title: Title,
        receiver_uid_list: ReceiverUID,
        creator_uid: SenderUID,
        creation_time: creation_time,
        message_id_list:[],
    })
    .then(function(docRef) {
        // Upon creation, perform encryption and post the first message ///////
        convoID = docRef.id;
        console.log(func_name,"-> SUCCESS: ID:", convoID);

        AddConversationToUser(convoID,SenderUID);

        // Perform first encryption layer
        Msg = creation_time + Msg;
        var SenderEMsg = aes256.encrypt(SenderPrivate, Msg);

        // Gather the public keys of every user in the conversation
        for(var i = 0; i < ReceiverUID.length; i++) {
            //var receiver_uid = ReceiverUID[i];
            console.log("\treceiver_uid: ",ReceiverUID[i]);
            db.collection('users').doc(ReceiverUID[i]).get().
            then(function(doc) {
                //console.log("\tsender_public_key: ",doc.data().public_key);

                var receiver_uid = doc.id;

                AddConversationToUser(convoID,receiver_uid);

                var pin = doc.data().public_key;
                var private = SenderEMsg;
                var sender_ee_msg = aes256.encrypt(pin, private);

                sendMessage(
                    sender_ee_msg,
                    creation_time,
                    receiver_uid,
                    SenderUID,convoID
                );
            });
        }
    })
    .catch(function(error) {
        console.error(func_name,"-> ERROR:", error);
    });
    response.send(convoID);
});



/*/////////////////////////////////////////////////////////////////////////////
Create a new user document
/////////////////////////////////////////////////////////////////////////////*/
app.post('/newuser', (request, response) => {
    var func_name = "/newuser";
    console.log(func_name);
    var creation_time = Date.now();
    var user_uid;
    db.collection("users").add({
        // Make a new user object /////////////////////////////////////////////
        conversations:[],
        creation_time:creation_time,
        email:"",
        online:false,
        public_key:"",
        username:""
    })
    .then(function(docRef) {
        user_uid = docRef.id;
        console.log(func_name,"-> SUCCESS: ID:", user_uid);
        response.send(user_uid);
    })
    .catch(function(error) {
        console.error(func_name,"-> ERROR:", error);
    });
});



/*/////////////////////////////////////////////////////////////////////////////
Mark a user offline
/////////////////////////////////////////////////////////////////////////////*/
app.post('/setoffline', (request, response) => {
    console.log("/setoffline");
    var uid = request.body.UID;
    console.log("\tUID: ", uid);
    var userRef = db.collection('users').doc(uid);
    var updateSingle = userRef.update({online:false});
    response.send("OK");
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
    var updateSingle = userRef.update({online:true});
    response.send("OK");
});



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
Anytime a conversation is created, we add the new conversation id to the
sender's and recevier's user document.
/////////////////////////////////////////////////////////////////////////////*/
function AddConversationToUser(conversation_id,user_uid) {
    var func_name = "AddConversationToUser() ->";
    console.log(func_name,"conversation_id:",conversation_id);
    console.log(func_name,"user_uid:",user_uid);
    var existing_conversation_id_list = [];
    db.collection('users').doc(user_uid).get()
    .then(function(doc, existing_conversation_id_list) {
        console.log(func_name,"user",user_uid,"has",
            doc.data().conversations.length,"existing conversations"
        );
        existing_conversation_id_list = doc.data().conversations;
        existing_conversation_id_list.push(conversation_id);
        var userRef = db.collection('users').doc(user_uid);
        userRef.update({conversations: existing_conversation_id_list});
    })
    .catch(function(error) {
        console.error(func_name,"ERROR:",error);
    });;
}



/*/////////////////////////////////////////////////////////////////////////////
Anytime a message is created, we add the new message id to the conversation
document that it belongs belongs to.
/////////////////////////////////////////////////////////////////////////////*/
function AddMessageToConversation(message_id, conversation_id) {
    var func_name = "AddMessageToConversation() ->";
    console.log(func_name,"message_id:",message_id);
    console.log(func_name,"conversation_id:",conversation_id);
    var existing_message_id_list = [];
    db.collection('conversations').doc(conversation_id).get()
    .then(function(doc, existing_message_id_list) {
        console.log(func_name,"conversation",conversation_id,"has",
            doc.data().message_id_list.length,"existing messages"
        );
        existing_message_id_list = doc.data().message_id_list;
        existing_message_id_list.push(message_id);
        var convoRef = db.collection('conversations').doc(conversation_id);
        convoRef.update({message_id_list: existing_message_id_list});
    })
    .catch(function(error) {
        console.error(func_name,"ERROR:",error);
    });;
}



/*/////////////////////////////////////////////////////////////////////////////
Send a message
/////////////////////////////////////////////////////////////////////////////*/
function sendMessage(SenderEEMsg, creation_time, ReceiverUID, SenderUID, conversation_id) {
  var func_name = "sendMessage() ->";
  console.log(func_name,"creation_time:",creation_time);
  console.log(func_name,"conversation_id:", conversation_id);
  console.log(func_name,"receiver_uid:", ReceiverUID);
  console.log(func_name,"sender_uid:", SenderUID);
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
      console.log(func_name,"SUCCESS: ID:", message_id);
      // Add the new message's id into the conversation it belongs to
      AddMessageToConversation(message_id,conversation_id);
  })
  .catch(function(error) {
      console.error(func_name,"ERROR:", error);
  });
  return message_id;
}



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
