import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OktaAuthService } from '@okta/okta-angular';
import * as OktaSignIn from '@okta/okta-signin-widget';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-secure',
  styleUrls: ['./login.component.scss'],
  template: `
    <!-- Container to inject the Sign-In Widget -->
    <div id="sign-in-widget"></div>
  `,
})
export class LoginComponent implements OnInit {
  signIn: any;
  constructor(
    public oktaAuth: OktaAuthService,
    public router: Router,
  ) {
    this.signIn = new OktaSignIn({
      /**
       * Note: when using the Sign-In Widget for an OIDC flow, it still
       * needs to be configured with the base URL for your Okta Org. Here
       * we derive it from the given issuer for convenience.
       */
      baseUrl: environment.oidc.issuer.split('/oauth2')[0],
      clientId: environment.oidc.clientId,
      redirectUri: environment.oidc.redirectUri,
      logo: '/assets/images/tc-logo.jpg',
      i18n: {
        en: {
          'primaryauth.title': 'Tennis Canada Stats Sign-in',
        },
      },
      authParams: {
        pkce: true,
        responseMode: 'query',
        issuer: environment.oidc.issuer,
        display: 'page',
        scopes: environment.oidc.scopes,
      },
    });
  }

  async ngOnInit() {
    this.signIn.renderEl(
      { el: '#sign-in-widget'},
      () => {
      },
      (err) => {
        throw err;
      }
    );
  }
}
