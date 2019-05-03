import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private email: string;
  private pass: string;

  constructor( private authService: AuthService ) { }

  ngOnInit() {
  }

  login() {
    console.log('username: ', this.email);
    console.log('pass: ', this.pass);
    this.authService.login(this.email, this.pass);
  }

}
