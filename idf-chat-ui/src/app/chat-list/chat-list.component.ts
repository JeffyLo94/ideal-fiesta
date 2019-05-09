import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Convos, EEncryptedMessage } from '../chat-objects.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  private exMessMap = new Map<string, EEncryptedMessage[]>([
    [
      '123456789', [
        {encryptedData: 'r message example'},
        {encryptedData: 'r message example 2'},
        {encryptedData: 'r message example 3'}
      ]
    ],
    [
      '123456700', [
        {encryptedData: 's message example'},
        {encryptedData: 's message example 2'},
        {encryptedData: 's message example 3'}
      ]
    ],
  ]);

  private exConvo1: Convos = {
    id: '123456789',
    title: 'chatconvo1',
    members: ['blah', 'blah2'],
    messages: this.exMessMap,
    lastUpdated: new Date().getTime(),
    createdOn: new Date().getTime()
  };

  convos: Convos[] = [];

  constructor() { }

  ngOnInit() {
    this.populateWithExample();
  }

  populateWithExample() {
    this.convos.push(this.exConvo1);
    console.log(this.convos.length);
  }

  trackFn(index, item) {
    return item.id;
  }
}
