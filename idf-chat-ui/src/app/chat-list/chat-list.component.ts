import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { Convos, EEncryptedMessage } from '../chat-objects.model';
import { ChatsService } from '../services/chats.service';
import { takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, OnDestroy {

  private readonly destroy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

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
  private convoSub: Subscription;
  convos: Convos[] = [];
  convosIds: string[] = [];

  constructor(private readonly chats: ChatsService) { }

  ngOnInit() {
    // this.populateWithExample();
    this.chats.convoMap$.pipe(
      // takeWhile( () => this.destroy$.value ),
      tap( () => {
        console.log('anyupdates?');
      })
    ).subscribe(
      (convoMap: Map<string, Convos>) => {
        console.log(`convo map: ${JSON.stringify(convoMap)}`);
        convoMap.forEach( (obj, id, dict) => {
          obj.id = id;
          if ( this.convosIds.includes(id) ){
            // convo already exists in array
            console.log(`convo ${id} updated`);
            const ind = this.convosIds.indexOf(id);
            this.convos[ind] = obj;
          } else {
            // new convo
            console.log(`convo ${id} added`);
            this.convosIds.push(id);
            this.convos.push(obj);
          }
        });
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next(false);
    this.destroy$.complete();
  }

  populateWithExample() {
    this.convos.push(this.exConvo1);
    console.log(this.convos.length);
  }

  trackFn(index, item) {
    return item.id;
  }
}
