import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {AppStateService} from './app-state.service';
import {OktaAuthService, UserClaims} from '@okta/okta-angular';
import {STATS_APPS, StatsApp} from '../assets/stats-apps';

@Component({
  selector: 'app-tc-stats-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;
  user: UserClaims;
  statsApps = STATS_APPS;

  constructor(
    public router: Router,
    public appState: AppStateService,
    public oktaAuth: OktaAuthService,
  ) {
    // subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => {
        this.isAuthenticated = isAuthenticated;
        this.onLoginStateChange(isAuthenticated);
      }
    );
  }

  async onLoginStateChange (newLoginState: boolean) {
    this.isAuthenticated = newLoginState;
    this.user = await this.oktaAuth.getUser();
    this.appState.setRights(this.user);
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
