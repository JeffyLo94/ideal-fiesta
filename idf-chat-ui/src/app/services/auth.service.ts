import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.loggedIn.asObservable();

  private options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };

  constructor(public  fireAuth: AngularFireAuth, public  router: Router, private readonly http: HttpClient) {
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  async signUp(email: string, pass: string) {
    try {
      return await this.fireAuth.auth.createUserWithEmailAndPassword( email, pass );
    } catch (e) {
      alert('Error with Sign Up!' + e.message);
    }
  }

  async login(email: string, pass: string) {
    try {
      console.log('fb auth logging in');
      await this.fireAuth.auth.signInWithEmailAndPassword( email, pass );
      this.setOnline(this.fireAuth.auth.currentUser.uid);
      this.loggedIn.next(true);
      this.router.navigate(['chat']);
    } catch (e) {
      alert('Error!' + e.message);
    }
  }

  async logout() {
    console.log('fb auth logging out');
    this.setOffline(this.currentUser.uid);
    await this.fireAuth.auth.signOut();
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.router.navigate(['login']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    const status = user !== null;
    // this.loggedIn.next(status);
    return status;
  }

  get currentUser(): User {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  private setOnline( uid: string ) {
    const url = 'http://localhost:3000/setonline';
    const body = {
      "UID": uid
    };
    console.log('setting user online: ', uid, body);
    this.http.post(url, body, this.options).subscribe();
  }

  private setOffline( uid: string ) {
    const url = 'http://localhost:3000/setoffline';
    const body = {
      "UID": uid
    };
    console.log('setting user offline: ', uid, body);
    this.http.post(url, body, this.options).subscribe();
  }
}
