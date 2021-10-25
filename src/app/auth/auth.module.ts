import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserAdminModule} from './user-admin/user-admin.module';
import {LoginModule} from './login/login.module';
import {AuthRoutingModule} from './auth-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UserAdminModule,
    LoginModule,
    AuthRoutingModule,
  ],
  exports: [
  ]

})
export class AuthModule {
}
