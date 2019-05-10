import { Component, OnInit } from '@angular/core';
import { HeaderLink, HeaderUser } from './header/header.component';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ChatsService } from './services/chats.service';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'idf-chat-ui';
  loginStatus = false;

  destroy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  chatLink: HeaderLink = {
    text: 'Chat',
    path: '/chat',
    icon: 'chat'
  };

  signUpLink: HeaderLink = {
    text: 'SignUp',
    path: 'new-account',
    icon: 'person_add'
  }

  appLinks = [];
  currUser: HeaderUser;

  constructor(private readonly router: Router,
              private readonly fbAuth: AuthService,
              private readonly chats: ChatsService) {
    this.setUserValue();
    console.log('app-root', this.currUser);
  }

  ngOnInit() {
    this.fbAuth.loggedIn$.pipe(
      takeWhile( () => this.destroy$.value )
    ).subscribe(
      (isLogged: boolean) => {
        console.log('loginStatus triggered: ', isLogged);
        this.setUserValue();
      }
    );
  }

  setUserValue() {
    if (this.fbAuth.isLoggedIn) {
      const fbUser = this.fbAuth.currentUser;
      this.currUser = {
        avatarUrl: '',
        name: ''
      };
      this.currUser.name = fbUser.email;
      this.currUser.avatarUrl = '';
      this.appLinks = [this.chatLink];
    } else {
      this.appLinks = [this.signUpLink];
      this.currUser = null;
    }
  }

  handleLogin(e) {
    console.log('login handler from app.component event: ', e);
    let url = 'login';
    this.router.navigate([url]);
  }

  handleLogout(e) {
    console.log('logout handler from app.component event: ', e);
    this.fbAuth.logout();
  }
}
