import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatsService } from '../services/chats.service';
import { takeWhile, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Convos } from '../chat-objects.model';

@Component({
  selector: 'app-chat-pane-view',
  templateUrl: './chat-pane-view.component.html',
  styleUrls: ['./chat-pane-view.component.scss']
})
export class ChatPaneViewComponent implements OnInit, OnDestroy {

  private destroy$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  currentConvo: Convos;

  constructor(private readonly chats: ChatsService) { }

  ngOnInit() {
    this.chats.focusedConvo$.pipe(
      takeWhile( () => this.destroy$.value ),
      map(
        (convObj: Convos) => {
          this.currentConvo = convObj;
        }
      )
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(false);
    this.destroy$.complete();
  }

  getConvoTitle() {
    return this.currentConvo ? this.currentConvo.title : '';
  }
}
