import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MessageService} from "./messages/message.service";

import { environment } from '../environments/environment';
// import {Okta} from "./auth/okta.service";

@Component({
  selector: 'tc-stats-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // oktaSignIn;
  user;
  title = 'Tennis Canada Competition Data';

  constructor(
    public router: Router,
    public messageService: MessageService,
    // private changeDetectorRef: ChangeDetectorRef,
    // private okta:Okta,
  ){
    // this.oktaSignIn = okta.getWidget();
  }

  // showLogin() {
  //   this.oktaSignIn.renderEl({el: '#okta-login-container'}, (response) => {
  //     console.log("sign-in response: " + JSON.stringify(response));
  //     if (response.status === 'SUCCESS') {
  //       this.user = response.claims.email;
  //       this.oktaSignIn.remove();
  //       this.changeDetectorRef.detectChanges();
  //       this.oktaSignIn.loginRedirect({ sessionToken: response.session.token });
  //     }
  //   });
  // }


  ngOnInit() {
    this.messageService.add(JSON.stringify(environment));
    // this.oktaSignIn.session.get((response) => {
    //   if (response.status !== 'INACTIVE') {
    //     this.user = response.login;
    //     this.changeDetectorRef.detectChanges();
    //   } else {
    //     this.showLogin();
    //   }
    // });

  }

  // async logout() {
  //   this.oktaSignIn.signOut(() => {
  //     this.user = undefined;
  //     this.changeDetectorRef.detectChanges();
  //     this.showLogin();
  //   });
  // }
}
