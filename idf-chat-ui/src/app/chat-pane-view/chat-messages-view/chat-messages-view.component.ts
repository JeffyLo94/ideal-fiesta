import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/chat-objects.model';

@Component({
  selector: 'app-chat-messages-view',
  templateUrl: './chat-messages-view.component.html',
  styleUrls: ['./chat-messages-view.component.scss']
})
export class ChatMessagesViewComponent implements OnInit {

  @Input() messages: Message[];

  constructor() { }

  ngOnInit() {
  }

  getMessageFrom( msg ) {
    return 'placeholder';
  }

  getAuthorFrom( msg ) {
    return 'placeholder';
  }
}
