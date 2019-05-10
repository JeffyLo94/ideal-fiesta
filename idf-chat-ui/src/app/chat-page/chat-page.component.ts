import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../services/chats.service';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {

  // headerLinks = [
  //   { text: 'Logout', path: 'passenger' }
  // ];

  constructor(private readonly fbAuth: AuthService, private readonly chats: ChatsService) { }

  ngOnInit() {
    if( this.fbAuth.isLoggedIn ) {
      this.chats.getConversationsFor(this.fbAuth.currentUser.uid);
    }
  }

}
