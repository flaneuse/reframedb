import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder, AbstractControl} from '@angular/forms';
import { HttpErrorResponse, HttpHeaders, HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import { MatDialog } from '@angular/material';

import { User } from '../../_models/index';
import { TermsComponent } from '../terms/terms.component';

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value;
    let confirmPassword = AC.get('confirmPassword').value;
    if(password != confirmPassword) {
      AC.get('confirmPassword').setErrors( {MatchPassword: true});
    } else {
      AC.get('confirmPassword').setErrors( null);
      return null
    }
  }
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
  user = new User(0, '', '', '', '', '', '', '', '','', '');
  form: FormGroup;
  recaptchaToken: string;
  loginResponse: string;
  regSuccess: boolean = false;

  constructor(private http: HttpClient, @Inject(FormBuilder) fb: FormBuilder, public dialog: MatDialog) {
    this.form = fb.group({
      name: fb.group({
        firstName: new FormControl('', Validators.minLength(2)),
        lastName: new FormControl('', Validators.minLength(2)),
      }),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      password: fb.group({
        password: new FormControl('', Validators.minLength(8)),
        confirmPassword: new FormControl('', Validators.minLength(8))
      }, {validator: PasswordValidation.MatchPassword}),
    });

  }

  ngOnInit() {
    console.log(this.form)
  }

  onSubmit(event){

    this.http.post('/api/auth/register',
      {"email": this.form.controls.email.value, "password": this.form.controls.password.value, "recaptcha_token": this.recaptchaToken}, {
        observe: 'response',
        // withCredentials: true,
        headers: new HttpHeaders()
          .set('content-type', 'application/json')
      }

    ).subscribe((re) => {
        let credentials = re.body;
        if (credentials['status'] === 'success') {
          //console.log(credentials['auth_token']);
          //localStorage.setItem('auth_token', credentials['auth_token']);

          console.log(JSON.stringify(re));
          this.loginResponse = credentials['message'];
          this.regSuccess = true;
          //location.reload();
          // console.log(re.status);

        } else if (credentials['status'] === 'fail') {
          this.loginResponse = credentials['message'];
          this.form.controls.password.reset();
          grecaptcha.reset();
        }
      },
      (err: HttpErrorResponse) => {
        this.loginResponse = err.error.message;
        console.log(err.error.message);
        console.log(JSON.stringify(err));
        console.log(err.status);
      }
    );
  }

  getErrorMessage() {
    return this.form.controls['email'].hasError('required') ? 'You must enter a value' :
      this.form.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

  resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response ${captchaResponse}:`);
    this.recaptchaToken = captchaResponse;
  }

  openTerms() {

    let dialogRef = this.dialog.open(TermsComponent, {
      width: '80vw',
      height: '80vh'
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log('Terms closed');
    });

  }

}
