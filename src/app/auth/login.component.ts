import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart} from '@angular/router';

import { OktaAuthService } from '@okta/okta-angular';
import * as OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-secure',
  styleUrls: ['./login.component.css'],
  template: `
    <!-- Container to inject the Sign-In Widget -->
    <div id="okta-signin-container"></div>
  `,
})
export class LoginComponent implements OnInit {

  widget = new OktaSignIn({
    baseUrl: 'https://dev-574317.oktapreview.com',
    logo: '../assets/images/tc-logo.jpg'
  });

  constructor(
    public oktaAuth: OktaAuthService,
    public router: Router,
    ) {
  }

  async ngOnInit() {
    this.widget.renderEl(
      { el: '#okta-signin-container'},
      (res) => {
        if (res.status === 'SUCCESS') {
          // Redirect to whatever the link was when the login was called.
          // the "fromURI" in oktaAuth get set automatically when using OktaAuthGuard
          // Geeze - none of the demos had this tid-bit of code.
          let fromURI = this.oktaAuth.getFromUri();
          this.oktaAuth.loginRedirect( fromURI.uri,{ sessionToken: res.session.token });
          // Hide the widget
          this.widget.hide();
        }
      },
      (err) => {
        throw err;
      }
    );
  }
}
