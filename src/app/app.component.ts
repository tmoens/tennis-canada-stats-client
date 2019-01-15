import {Component, OnInit} from '@angular/core';

import {Router} from "@angular/router";
import {AppStateService} from "./app-state.service";
import {OktaAuthService} from "@okta/okta-angular";
import {RatingService} from "./external-tournaments/rating-service.service";

@Component({
  selector: 'tc-stats-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuthenticated:boolean;
  user: any;

  constructor(
    public router: Router,
    public appState: AppStateService,
    public oktaAuth: OktaAuthService,
  ){
    // subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => {
        this.isAuthenticated = isAuthenticated;
        this.onLoginStateChange(isAuthenticated);
      }
    );
  }

  async onLoginStateChange (newLoginState:boolean) {
    this.isAuthenticated = newLoginState;
    this.user = await this.oktaAuth.getUser();
  }

  async ngOnInit() {
    // get authentication state for immediate use
    this.onLoginStateChange(await this.oktaAuth.isAuthenticated());
  }

  async logout() {
    // Terminates the session with Okta and removes current tokens.
    await this.oktaAuth.logout();
    this.router.navigateByUrl('/');
  }

}
