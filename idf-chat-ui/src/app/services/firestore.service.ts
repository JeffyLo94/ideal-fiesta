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
    return this.fs.collection('users').add(user);
  }

  updateUser(user: User) {
    delete user.uid;
    this.fs.doc('users/' + user.id).update(user);
  }

  deleteUser(userId: string) {
    this.fs.doc('user/' + userId).delete();
  }
}
