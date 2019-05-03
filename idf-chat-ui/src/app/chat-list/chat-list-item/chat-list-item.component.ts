import { Component, OnInit, Input } from '@angular/core';
import { Convos } from 'src/app/chat-objects.model';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.scss']
})
export class ChatListItemComponent implements OnInit {

  @Input() convo: Convos;
  newItem = true;
  oldItem = false;

  constructor() { }

  ngOnInit() {
  }

  onGetChatTitle() {
    return 'blah';
  }

  onGetLastUpdated() {
    return Date.UTC(2019, 4, 20);
  }

}
