import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { User } from '../chat-objects.model';

@Injectable({
  providedIn: 'root'
})
export class AccountCreationService {

  users: User[];

  constructor(private fs: FirestoreService) {
    this.fs.getUsers().subscribe( data => {
      let a = data.map(e => {
        return {
          id: e.payload.doc.id,
          email: e.payload.doc.get('email')
        }
      })
    });
  }
}
