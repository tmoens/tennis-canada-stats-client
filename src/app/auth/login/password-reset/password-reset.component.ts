import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthApiService } from '../../auth-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStateService } from '../../../app-state.service';
import { UserDTO } from '../../UserDTO';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent {
  usernameOrEmail: string;

  constructor(
    public dialogRef: MatDialogRef<PasswordResetComponent>,
    private authApiService: AuthApiService,
    private message: MatSnackBar,
    private appState: AppStateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.username) {
      this.usernameOrEmail = data.username;
    }
  }

  onSubmit() {
    this.authApiService
      .resetPassword({ usernameOrEmail: this.usernameOrEmail })
      .subscribe((u: UserDTO) => {
        if (u) {
          this.message.open(
            'A new password has been sent to ' +
              u.email +
              '. Please use it to and change your password',
            null,
            { duration: this.appState.getState('confirmMessageDuration') }
          );
          this.dialogRef.close({ username: u.username });
        }
      });
  }

  onBackToLogin() {
    this.dialogRef.close({ username: this.usernameOrEmail });
  }
}
