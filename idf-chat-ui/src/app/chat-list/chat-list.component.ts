import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Convos } from '../chat-objects.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();
  convos: Convos[] = [];

  constructor() { }

  ngOnInit() {
  }

  trackFn(index, item) {
    return item.id;
  }
}
