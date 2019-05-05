import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;


  constructor(public  fireAuth: AngularFireAuth, public  router: Router) {
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
      await this.fireAuth.auth.signInWithEmailAndPassword( email, pass );
      this.router.navigate(['chat']);
    } catch (e) {
      alert('Error!' + e.message);
    }
  }

  async logout() {
    await this.fireAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  get currentUser(): User {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }
}
