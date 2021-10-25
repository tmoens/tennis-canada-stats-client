import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginContainerComponent } from './login/login-container.component';
import {LoginComponent} from './login/login.component';
import {PasswordChangeContainerComponent} from './password-change/password-change-container.component';
import {PasswordChangeComponent} from './password-change/password-change.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';



@NgModule({
  declarations: [
    LoginContainerComponent,
    LoginComponent,
    PasswordChangeContainerComponent,
    PasswordChangeComponent,
    PasswordResetComponent,
  ],
  exports: [
    LoginContainerComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class LoginModule { }
