import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserPasswordChangeDTO } from '../../UserDTO';
import { AppStateService } from '../../../app-state.service';
import { AuthApiService } from '../../auth-api.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
})
export class PasswordChangeComponent {
  mfForm = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, passwordValidator(7, 50)]],
      repeatNewPassword: ['', [Validators.required]],
    },
    { validators: repeatPasswordValidator }
  );

  constructor(
    public dialogRef: MatDialogRef<PasswordChangeComponent>,
    private authApiService: AuthApiService,
    private message: MatSnackBar,
    private fb: UntypedFormBuilder,
    public appState: AppStateService,
    private authService: AuthService
  ) {}

  onSubmit() {
    const dto: UserPasswordChangeDTO = this.mfForm.getRawValue();
    this.authApiService.passwordChange(dto).subscribe((token: any) => {
      if (token) {
        this.dialogRef.close();
        this.authService.onLogin(token.access_token);
        this.message.open('Your password has been changed.', null, {
          duration: this.appState.getState('confirmMessageDuration'),
        });
      }
    });
  }
}

const repeatPasswordValidator: ValidatorFn = (
  control: UntypedFormGroup
): ValidationErrors | null => {
  const np = control.get('newPassword');
  const rp = control.get('repeatNewPassword');
  if (np && rp && np.value && np.value === rp.value) {
    control.setErrors(null);
    return null;
  } else {
    control.setErrors({ mismatch: true });
    return { mismatch: true };
  }
};

function passwordValidator(
  minLength: number,
  minStrength: number
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pass = String(control.value);
    let errors: ValidationErrors = null;

    if (pass.length < minLength) {
      errors = { minLength: minLength };
    }

    let score = 0;

    // award every unique letter until 5 repetitions
    const letters = {};
    for (const char of pass) {
      letters[char] = (letters[char] || 0) + 1;
      score += 5.0 / letters[char];
    }

    // bonus points for mixing it up
    const variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /\W/.test(pass),
    };

    let variationCount = 0;
    for (const check of Object.keys(variations)) {
      variationCount += variations[check] === true ? 1 : 0;
    }

    score += (variationCount - 1) * 10;

    if (score < minStrength) {
      if (!errors) {
        errors = {};
      }
      errors.strength = score;
    }

    return errors;
  };
}
