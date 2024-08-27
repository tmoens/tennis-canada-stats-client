import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AppStateService } from './app-state.service';
import { AuthApiService } from './auth/auth-api.service';
import { AuthService } from './auth/auth.service';
import { STATSTOOL } from '../assets/stats-tools';

@Component({
  selector: 'app-tc-stats-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  statsTools = STATSTOOL;

  constructor(
    public router: Router,
    public appState: AppStateService,
    private authApiService: AuthApiService,
    public authService: AuthService
  ) {}

  login() {
    this.router.navigateByUrl('/login').then();
  }

  changePassword() {
    this.router.navigateByUrl('/change_password').then();
  }

  logout() {
    if (this.authService.isAuthenticated) {
      this.authApiService.logout().subscribe(() => {
        this.authService.onLogout();
        this.router.navigateByUrl('/login').then();
      });
    }
  }
}
