import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { interval, Subject, BehaviorSubject, forkJoin, of } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { map, take, takeUntil, concatMap, tap, catchError } from 'rxjs/operators';
import { Convos, User } from '../chat-objects.model';

export interface OnlineUser {
  id: string;
  email: string;
  username: string;
  online: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class ChatsService implements OnInit, OnDestroy {

  private readonly convosPollTimer$ = interval(1000);
  private readonly convosPollDestroy$: Subject<boolean> = new Subject<boolean>();

  private readonly userCheckTimer$ = interval(1000);
  private readonly userCheckDestroy$: Subject<boolean> = new Subject<boolean>();

  private readonly convoMapSubject =  new BehaviorSubject< Map<string, Convos> >( new Map<string, Convos>() );
  public convoMap$ = this.convoMapSubject.asObservable();
  private convoMap: Map<string, Convos> = new Map<string, Convos>();

  private readonly convoList: BehaviorSubject<Convos[]> = new BehaviorSubject<Convos[]>([]);
  public convoList$ = this.convoList.asObservable();

  private readonly focusedConvo: BehaviorSubject< Convos > = new BehaviorSubject(null);
  public focusedConvo$ = this.focusedConvo.asObservable();

  private readonly onlineUsers: BehaviorSubject< OnlineUser[] > = new BehaviorSubject([]);
  public onlineUsers$ = this.onlineUsers.asObservable();
  private userList: OnlineUser[];

  private options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };

  constructor(private readonly http: HttpClient, private readonly fs: FirestoreService) { }

  ngOnInit() {
    this.userCheckTimer$.pipe(
      takeUntil(this.userCheckDestroy$)
    ).subscribe(
      () => {
        this.getUsers();
      }
    );
  }

  ngOnDestroy() {
    this.convosPollDestroy$.next(true);
    this.convosPollDestroy$.complete();
    this.userCheckDestroy$.next(true);
    this.userCheckDestroy$.complete();
  }

  private updateOnline() {
    let newList: OnlineUser[] = [];
    this.userList.forEach( (usr, i, arr) => {
      if ( usr.online ) {
        newList.push(usr);
      }
    });

    this.onlineUsers.next(newList);
  }

  public getUsers() {
    this.fs.getUsers().pipe(
      take(1)
    ).subscribe(
      (data) => {
        console.log('chatservice getUsers', data);
        this.userList = data.map(e => {
          console.log(`id: ${e.payload.doc.id} and data: ${JSON.stringify(e.payload.doc.data())}`);
          return {
            id: e.payload.doc.id,
            email: e.payload.doc.get('email'),
            username: e.payload.doc.get('username'),
            online: e.payload.doc.get('online')
          } as OnlineUser;
        });

        this.updateOnline();
      }
    );
  }

  private getServerURL() {
    return 'http://localhost:3000';
  }

  public clearMap() {
    this.convoMap = new Map<string, Convos>();
  }

  public getConversationsFor( userId: string ) {
    const url = this.getServerURL() + '/getconvos';
    const body = {
      UID : userId
    };
    this.http.post<string[]>(url, body, this.options).pipe(
      concatMap( (convoIds: string[]) => {
        console.log('recieved convos: ', convoIds);
        const obsArr = [];
        if (convoIds) {
          for ( const id of convoIds ) {
            const obs = this.fs.getConversation(id).pipe(
              take(1),
              tap( (e) => console.log('******', e)),
              map(
                (conv: Convos) => {
                  console.log('added a convo to map:', conv);
                  this.convoMap.set(id, conv);
                  return true;
                }
              )
            );
            obsArr.push(obs);
          }
        }
        return forkJoin(obsArr);
      }),
      concatMap( () => {
        console.log(`convo map after get: ${JSON.stringify(this.convoMap)}`);
        this.convoMapSubject.next(new Map(this.convoMap));
        return of(true);
      })
    ).subscribe();
  }

  public setFocusedConvo( convoId ) {
    if (this.convoMap.has(convoId)) {
      this.focusedConvo.next(this.convoMap.get(convoId));
    } else {
      console.log(`conversation with id: ${convoId} not found`);
    }
  }


}
