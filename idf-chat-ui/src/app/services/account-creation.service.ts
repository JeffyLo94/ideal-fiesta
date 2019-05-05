import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../chat-objects.model';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountCreationService implements OnDestroy {
  user: User;

  userListData: BehaviorSubject<User[]> = new BehaviorSubject([]);
  userList$: Observable<User[]> = this.userListData.asObservable();

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private fs: FirestoreService, private as: AuthService) {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  requestUsersFromDatabase() {
    return this.fs.getUsers().pipe(
      takeUntil(this.destroy$),
      map( (users) => {
        return users.map( (a) => {
            const userData = a.payload.doc.data();
            const id = a.payload.doc.id;
          }
        );
      })
    ).subscribe();
  }
}
