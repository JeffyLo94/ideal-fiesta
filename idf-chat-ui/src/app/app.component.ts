import { Component, OnInit } from '@angular/core';
import { HeaderLink, HeaderUser } from './header/header.component';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'idf-chat-ui';

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
  currUser: HeaderUser = {
    avatarUrl: '',
    name: ''
  };

  constructor(private readonly router: Router, private readonly fbAuth: AuthService) {
    console.log(this.currUser);
    if (this.fbAuth.isLoggedIn) {
      const fbUser = this.fbAuth.currentUser;
      this.currUser.name = fbUser.email;
      this.currUser.avatarUrl = '';
      this.appLinks = [this.chatLink];
    } else {
      this.appLinks = [this.signUpLink];
      this.currUser = null;
    }
  }

  ngOnInit() {

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
