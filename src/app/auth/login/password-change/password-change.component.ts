import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {UserPasswordChangeDTO} from '../../UserDTO';
import {AppStateService} from '../../../app-state.service';
import {AuthApiService} from '../../auth-api.service';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-password-change',
  template: `
    <section class="mat-typography">
      <div mat-dialog-title>Password Change</div>
      <form [formGroup]="mfForm" (ngSubmit)="onSubmit()">
        <div fxLayout="column" mat-dialog-content>
          <mat-form-field>
            <input type="password" matInput placeholder="Current Password" formControlName="currentPassword">
          </mat-form-field>
          <mat-form-field>
            <input type="password" matInput placeholder="New Password" formControlName="newPassword">
            <mat-error *ngIf="mfForm.get('newPassword').errors?.minLength">Password must be at
              least 7 characters long
            </mat-error>
            <mat-error *ngIf="mfForm.get('newPassword').errors?.strength">Your password strength is poor
              (score: {{mfForm.get('newPassword').errors.strength}}).
              <br>It needs to be at least 50.
              <br>Add length and/or variation (uppercase/lowercase/digits/special characters) to improve it.
            </mat-error>
          </mat-form-field>
          <mat-form-field>
            <input type="password" matInput placeholder="Repeat New Password" formControlName="repeatNewPassword">
            <mat-error *ngIf="mfForm.errors?.mismatch">Mismatch</mat-error>
          </mat-form-field>
        </div>
        <div mat-dialog-actions fxLayout="row">
          <div class="fill-remaining-space"></div>
          <button [disabled]="mfForm.invalid" mat-button (click)="onSubmit()" color="primary">Submit</button>
        </div>
      </form>
    </section>
    <!--<p>password errors: {{mfForm.get('newPassword').errors | json}}</p>-->
    <!--<p>form errors: {{mfForm.errors | json}}</p>-->
    <!--<p>form invalid: {{mfForm.invalid | json}}</p>-->
  `,
})

export class PasswordChangeComponent implements OnInit {

  mfForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required,
      passwordValidator(
        7, 50, false, false, false, false)
    ]],
    repeatNewPassword: ['', [Validators.required]],
  }, {validators: repeatPasswordValidator});

  constructor(
    public dialogRef: MatDialogRef<PasswordChangeComponent>,
    private authApiService: AuthApiService,
    private message: MatSnackBar,
    private fb: FormBuilder,
    public appState: AppStateService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const dto: UserPasswordChangeDTO = this.mfForm.getRawValue();
    this.authApiService.passwordChange(dto).subscribe( (token: any) => {
      if (token) {
        this.dialogRef.close();
        this.authService.onLogin(token.access_token);
        this.message.open(
          'Your password has been changed.',
          null, {duration: this.appState.getState('confirmMessageDuration')});
      }
    });
  }
}

const repeatPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const np = control.get('newPassword');
  const rp = control.get('repeatNewPassword');
  if (np && rp && np.value && np.value === rp.value) {
    control.setErrors(null);
    return null;
  } else {
    control.setErrors({'mismatch': true});
    return { 'mismatch': true};
  }
};

function passwordValidator(
  minLength: number,
  minStrength: number,
  requiresUC: boolean = false,
  requiresLC: boolean = false,
  requiresNumbers: boolean = false,
  requiresSpecialCharacters: boolean = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pass: string = String(control.value);
    let errors: ValidationErrors = null;

    if (pass.length < minLength) {
      errors = {'minLength': minLength };
    }

    let score = 0;

    // award every unique letter until 5 repetitions
    const letters = {};
    for (let i = 0; i < pass.length; i++) {
      letters[pass[i]] = (letters[pass[i]] || 0) + 1;
      score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    const variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /\W/.test(pass),
    };

    let variationCount = 0;
    for (const check in variations) {
      variationCount += (variations[check] === true) ? 1 : 0;
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
