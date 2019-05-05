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
Generate a public key
/////////////////////////////////////////////////////////////////////////////*/
app.post('/genpublic', (request, response) => {
    var func_name = "/genpublic ->";
    var user_id = request.body.user_id;
    var pin = request.body.pin;
    var public_key = aes256.encrypt(pin,user_id);
    console.log(
        func_name,"\n",
        "\t","user_id:",user_id,"\n",
        "\t","pin:",pin,"\n",
        "\t","public_key:",public_key,"\n"
    );
    setPublicKey(user_id,public_key)
    response.send(public_key);
});



/*/////////////////////////////////////////////////////////////////////////////
Retrieve the list of conversation ids a given user belongs to.
/////////////////////////////////////////////////////////////////////////////*/
app.post('/getconvos', (request, response) => {
    var func_name = "/getconvos ->";
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
Retrieve a specific message.
/////////////////////////////////////////////////////////////////////////////*/
app.post('/getmsg', (request, response) => {
    var func_name = "/getmsg ->";
    // Collect data from the request //////////////////////////////////////////
    var message_id = request.body.message_id;
    var receiver_id = request.body.receiver_id;
    var sender_id = request.body.sender_id;
    console.log(
        func_name,"\n",
        "\t","message_id:",message_id,"\n",
        "\t","receiver_id:",receiver_id,"\n",
        "\t","sender_id:",sender_id,"\n"
    );
    response.send(getMessage(message_id,receiver_id,sender_id));
});



/*/////////////////////////////////////////////////////////////////////////////
Control flow # 8.0.b. -> 8.4
Starting a new conversation
/////////////////////////////////////////////////////////////////////////////*/
app.post('/newconvo', (request, response) => {
    var func_name = "/newconvo ->";
    // Unpackage and document the request /////////////////////////////////////
    var sender_id = request.body.sender_id;
    var receiver_list = request.body.receiver_list;
    var title = request.body.title;
    var msg = request.body.msg;
    console.log(func_name,"sender_id:", sender_id);
    console.log(func_name,"title:", title);
    console.log(func_name,"msg:", msg);
    var timestamp = Date.now();
    var conversation_id;
    db.collection('conversations').add({
        // Make a new conversation object /////////////////////////////////////
        title: title,
        receiver_list: receiver_list,
        creator_uid: sender_id,
        timestamp: timestamp,
        message_list:[],
    })
    .then(function(docRef) {
        // Upon creation, perform encryption and post the first message ///////
        conversation_id = docRef.id;
        console.log(func_name,"SUCCESS: ID:", conversation_id);
        AddConversationToUser(conversation_id,sender_id);
        // Gather the public keys of every user in the conversation
        for(var i = 0; i < receiver_list.length; i++) {
            db.collection('users').doc(receiver_list[i]).get().
            then(function(doc) {
                var receiver_id = doc.id;
                AddConversationToUser(conversation_id,receiver_id);
                sendMessage(
                    conversation_id,
                    msg,
                    receiver_id,
                    sender_id,
                    timestamp
                );
            });
        }
    })
    .catch(function(error) {
        console.error(func_name,"-> ERROR:", error);
    });
    response.send(conversation_id);
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
        console.log(func_name,"-> SUCCESS: ID:",user_uid);
        response.send(user_uid);
    })
    .catch(function(error) {
        console.error(func_name,"-> ERROR:",error);
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
Send a message
/////////////////////////////////////////////////////////////////////////////*/
app.post('/sendmsg',(request, response) => {
    var func_name = "/sendmsg ->";
    // Capture information from the request ///////////////////////////////////
    var conversation_id = request.body.conversation_id;
    var msg = request.body.msg;
    var receiver_id = request.body.receiver_id;
    var sender_id = request.body.sender_id;
    var timestamp = Date.now();
    // Perform the transaction ////////////////////////////////////////////////
    sendMessage(
        conversation_id,
        msg,
        receiver_id,
        sender_id,
        timestamp
    );
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
Test encryption and decryption
/////////////////////////////////////////////////////////////////////////////*/
app.post('/testaes', (request, response) => {
    console.log("/testaes");
    //var pin     = request.body.PIN;
    //var private = request.body.PRIVATE;
    var encrypted = aes256.encrypt("GYnACAngG+qQm2r1DKsbXeg6UgK+H+L9/g==OFytRX4wPit3aBvGLF6CHzsPBueeu4Bd/w==","mymessage");
    console.log("encrypted",encrypted);
    var decrypted = aes256.decrypt("GYnACAngG+qQm2r1DKsbXeg6UgK+H+L9/g==OFytRX4wPit3aBvGLF6CHzsPBueeu4Bd/w==",encrypted);
    console.log("decrypted",decrypted);
    //console.log("\tPIN: ", pin);
    //console.log("\tPRIVATE: ", private);
    //console.log("\tEncrypted Private: ", encrypted);
    response.send(decrypted);
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
    var existing_message_list = [];
    db.collection('conversations').doc(conversation_id).get()
    .then(function(doc, existing_message_list) {
        console.log(func_name,"conversation",conversation_id,"has",
            doc.data().message_list.length,"existing messages"
        );
        existing_message_list = doc.data().message_list;
        existing_message_list.push(message_id);
        var convoRef = db.collection('conversations').doc(conversation_id);
        convoRef.update({message_list: existing_message_list});
    })
    .catch(function(error) {
        console.error(func_name,"ERROR:",error);
    });;
}



/*/////////////////////////////////////////////////////////////////////////////
Given a message id, receiver and sender, retrieve the correct public keys,
decrypt and return the plaintext message.
/////////////////////////////////////////////////////////////////////////////*/
function getMessage(
    message_id,receiver_id,sender_id) {
    var func_name = "getMessage() ->";
    // First get sender's public key //////////////////////////////////////////
    db.collection('users').doc(sender_id).get()
    .then(function(doc) {
        var sender_public = doc.data().public_key;
        console.log(
            func_name,"\n",
            "\t","sender_public:",sender_public,"\n"
        );
        // Next get receiver's public key /////////////////////////////////////
        db.collection('users').doc(receiver_id).get()
        .then(function(doc) {
            var receiver_public = doc.data().public_key;
            console.log(
                func_name,"\n",
                "\t\t","receiver_public:",receiver_public,"\n"
            );
            db.collection('messages').doc(message_id).get()
            .then(function(doc) {
                // Decrypt the message ////////////////////////////////////////////
                var msg_encrypted = doc.data().msg_encrypted;
                var msg_decrypted = aes256.decrypt(
                    sender_public+receiver_public,msg_encrypted
                );
                console.log(
                    func_name,"\n",
                    "\t\t\t","msg_encrypted:",msg_encrypted,"\n",
                    "\t\t\t","msg_decrypted:",msg_decrypted,"\n"
                );
                return msg_decrypted;
            })
            .catch(function(error) {
                console.error(func_name,"ERROR GETTING MESSAGE DOC:",error);
            });;
        })
        .catch(function(error) {
            console.error(func_name,"ERROR GETTING RECEIVER DOC:",error);
        });;
    })
    .catch(function(error) {
        console.error(func_name,"ERROR GETTING SENDER DOC:",error);
    });;
}



/*/////////////////////////////////////////////////////////////////////////////
Find and return a specified user's public key
/////////////////////////////////////////////////////////////////////////////*/
function getPublic(user_id) {
    var func_name = "getPublic() ->";
    db.collection('users').doc(user_id).get()
    .then(function(doc) {
        var public_key = doc.data().public_key;
        console.log(
            func_name,"\n",
            "\t","user_id:",user_id,"\n",
            "\t","public_key:",public_key,"\n"
        );
        return public_key;
    })
    .catch(function(error) {
        console.error(func_name,"ERROR:",error);
    });;
}



/*/////////////////////////////////////////////////////////////////////////////
Given a conversation, plaintext message, receiver, sender and timestamp,
retrieve the correct public keys, encrypt the message and create the new
message document.
/////////////////////////////////////////////////////////////////////////////*/
function sendMessage(
    conversation_id,msg,receiver_id,sender_id,timestamp) {
    var func_name = "sendMessager() ->";
    // First get sender's public key //////////////////////////////////////////
    db.collection('users').doc(sender_id).get()
    .then(function(doc) {
        var sender_public = doc.data().public_key;
        // Next get receiver's public key /////////////////////////////////////
        db.collection('users').doc(receiver_id).get()
        .then(function(doc) {
            var receiver_public = doc.data().public_key;
            // Encrypt the message ////////////////////////////////////////////
            var msg_encrypted = aes256.encrypt(
                sender_public+receiver_public,msg
            );
            // Now finally send the message ///////////////////////////////////
            db.collection('messages').add({
                conversation_id:conversation_id,
                msg_encrypted:msg_encrypted,
                receiver_id:receiver_id,
                receiver_read:false,
                sender_id:sender_id,
                timestamp:timestamp
            })
            .then(function(docRef) {
                var message_id = docRef.id;
                console.log(func_name,"SUCCESS: ID:", message_id);
                // Add the new message's id into the conversation it belongs to
                AddMessageToConversation(message_id,conversation_id);
            })
            .catch(function(error) {
                console.error(func_name,"ERROR ADDING MESSAGE DOC:", error);
            });
        })
        .catch(function(error) {
            console.error(func_name,"ERROR GETTING RECEIVER DOC:",error);
        });;
    })
    .catch(function(error) {
        console.error(func_name,"ERROR GETTING SENDER DOC:",error);
    });;
}



/*/////////////////////////////////////////////////////////////////////////////
Add public key to a document in the "users" collection
/////////////////////////////////////////////////////////////////////////////*/
function setPublicKey(user_id,public_key) {
    var func_name = "setPublicKey() ->";
    var user_doc = db.collection('users').doc(user_id);
    var updateSingle = user_doc.update({public_key: public_key});
}
