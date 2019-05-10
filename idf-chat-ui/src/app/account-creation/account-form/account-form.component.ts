import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { User } from 'src/app/chat-objects.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';

export class PasswordErrSM implements ErrorStateMatcher {
  isErrorState( control: FormControl | null, form: FormGroupDirective | NgForm |null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {

  acctForm: FormGroup;
  passwordMatcher = new PasswordErrSM();
  user: User;
  isHidden: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private fa: AuthService,
              private fs: FirestoreService,
              private router: Router) {
    this.acctForm = this.formBuilder.group({
      email: [''],
      username: [''],
      password: ['', [Validators.required]],
      confirmPassword: [''],
      PIN: ['']
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  toggleHide() {
    this.isHidden = !this.isHidden;
    return this.isHidden;
  }

  submitAcct() {
    console.log(`
    Form:
    email: ${this.acctForm.get('email').value}
    username: ${this.acctForm.get('username').value}
    password: ${this.acctForm.get('password').value}
    confirmPassword: ${this.acctForm.get('confirmPassword').value}
    `);
    this.fa.signUp(this.acctForm.get('email').value, this.acctForm.get('password').value).then(
      () => {
        let newid = this.fa.currentUser.uid;
        let newpin = this.acctForm.get('PIN').value;
        let newUser: User = {
          id: newid,
          uid: newid,
          email: this.acctForm.get('email').value,
          pass: this.acctForm.get('password').value,
          username: this.acctForm.get('username').value,
          online: false,
          conversations: [],
          public_key: '',
          pin: newpin
        };

        this.fs.createUser(newUser).then(
          () => {
            this.fa.generateAESKeys( newid, newpin );
          }
        );
        console.log('new user attempted to be created');
        this.router.navigate(['login']);

      }
    );
  }
}
