import {Component, OnInit} from '@angular/core';
import {MessageService} from "./messages/message.service";

import { environment } from '../environments/environment';
import {Observable} from "rxjs";
import {BreakpointObserver, Breakpoints} from "../../node_modules/@angular/cdk/layout";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
import {AppStateService} from "./app-state.service";
import {OktaAuthService} from "@okta/okta-angular";

@Component({
  selector: 'tc-stats-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuthenticated:boolean;

  constructor(
    public router: Router,
    public appState: AppStateService,
    public oktaAuth: OktaAuthService,
  ){
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
    );
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
  }

  // login() {
  //   this.oktaAuth.loginRedirect('/profile');
  // }

  async logout() {
    // Terminates the session with Okta and removes current tokens.
    await this.oktaAuth.logout();
    this.router.navigateByUrl('/home');
  }

}
