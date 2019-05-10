import { Component, OnInit, Input } from '@angular/core';
import { Convos } from 'src/app/chat-objects.model';
import { ChatsService } from 'src/app/services/chats.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.scss']
})
export class ChatListItemComponent implements OnInit {

  @Input() convo: Convos;
  newItem = true;
  oldItem = false;

  constructor(private readonly chats: ChatsService, private readonly fs: FirestoreService) { }

  ngOnInit() {
    console.log('list Item Convo: ', this.convo);
  }

  onGetChatTitle() {
    // console.log(`got title ${this.convo.title}`);
    return this.convo.title;
  }

  onGetLastUpdated() {
    // console.log(`got title ${this.convo.lastUpdated}`);
    return this.convo.lastUpdated;
  }

  onGetStatusColor() {
    return 'white';
  }

  onItemClicked() {
    console.log(`chat id: ${this.convo.id} clicked`);
    this.chats.setFocusedConvo(this.convo.id);
    // if (this.convo.messages) {
    //   console.log(`Message IDs: ${this.convo.messages}`);
    //   this.convo.messages.forEach(
    //     (val, ind, arr) => {
    //       this.fs.getMessage(val).pipe(
    //         map( () => {

    //         })
    //       ).subscribe();

    //     }
    //   )
    // }
    // this.fs.getMessage(this.)
  }

}
