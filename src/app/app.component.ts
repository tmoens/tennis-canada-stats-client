import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {AppStateService} from './app-state.service';
import {MatDialog} from '@angular/material/dialog';
import {AuthApiService} from './auth/auth-api.service';
import {AuthService} from './auth/auth.service';
import {STATS_TOOL_GROUPS} from '../assets/stats-tool-groups';
import {STATSTOOL} from '../assets/stats-tools';

@Component({
  selector: 'app-tc-stats-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  statsToolGroups = STATS_TOOL_GROUPS;
  statsTools = STATSTOOL;

  constructor(
    public router: Router,
    public appState: AppStateService,
    private passwordChangeDialog: MatDialog,
    private authApiService: AuthApiService,
    public authService: AuthService,

  ) {
  }

  ngOnInit() {
  }

  login() {
    this.router.navigateByUrl('/login').then();
  }
  changePassword() {
    this.router.navigateByUrl('/change_password').then();
  }

  logout() {
    if (this.authService.isAuthenticated) {
      this.authApiService.logout().subscribe( () => {
        this.authService.onLogout();
        this.router.navigateByUrl('/login').then();
      });
    }
  }

}
