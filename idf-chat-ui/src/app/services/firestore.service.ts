import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Convos, User, EncryptedMessage, EEncryptedMessage } from 'src/app/chat-objects.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor( private fs: AngularFirestore) { }

  getUsers() {
    console.log('fs getting Users');
    return this.fs.collection('users').snapshotChanges();
  }

  createUser(user: User) {
    console.log('fs creating Users');
    return this.fs.collection('users').doc(user.id).set(user);
  }

  updateUser(user: User) {
    delete user.uid;
    this.fs.doc('users/' + user.id).update(user);
  }

  deleteUser(userId: string) {
    this.fs.doc('user/' + userId).delete();
  }

  getConversations() {
    console.log('fs getting conversations');
    return this.fs.collection('conversations').snapshotChanges();
  }

  getConversation( convoId: string ) {
    console.log('fs getting convo - ', convoId);
    return this.fs.collection('conversations').doc(convoId).valueChanges();
  }

  createConversation(convo: Convos) {
    console.log('fs creating convo');
    return this.fs.collection('conversations').add(convo);
  }

  updateConversation(convo: Convos) {
    delete convo.id;
    this.fs.doc('conversation/' + convo.id).update(convo);
  }

  deleteConversation(convoId: string) {
    this.fs.doc('conversation/' + convoId).delete();
  }

  getMessage( msgID: string ) {
    console.log('fs getting msgid - ', msgID);
    return this.fs.collection('messages').doc(msgID).valueChanges();
  }
}
