import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { AuthApiService } from '../../auth-api.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tc-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = null;
  password: string = null;

  usernameFC: UntypedFormControl = new UntypedFormControl('');
  passwordFC: UntypedFormControl = new UntypedFormControl();

  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<LoginComponent>,
    private authApiService: AuthApiService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.username) {
      this.usernameFC.setValue(data.username);
    }
    dialogRef.disableClose = true;
  }

  onSubmit() {
    this.authApiService
      .login(this.usernameFC.value, this.passwordFC.value)
      .subscribe((token: any) => {
        if (token) {
          this.dialogRef.close();
          this.authService.onLogin(token.access_token);
          this.router.navigateByUrl('/home').then();
        } else {
          this.authService.onLoginFailed();
        }
      });
  }

  onForgotPassword() {
    this.dialogRef.close({ reset: true, username: this.username });
  }
}
