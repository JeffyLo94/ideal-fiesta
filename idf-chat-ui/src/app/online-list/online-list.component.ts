import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../chat-objects.model';
import { ChatsService, OnlineUser } from '../services/chats.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-online-list',
  templateUrl: './online-list.component.html',
  styleUrls: ['./online-list.component.scss']
})
export class OnlineListComponent implements OnInit, OnDestroy {

  private onlineUsers: OnlineUser[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(private readonly chats: ChatsService) {
    chats.onlineUsers$.pipe(
      takeUntil( this.destroy$ )
    ).subscribe(
      (list: OnlineUser[]) => {
        this.onlineUsers = list;
      }
    );
  }

  ngOnInit() {
    this.chats.getUsers();
    console.log(this.onlineUsers);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
