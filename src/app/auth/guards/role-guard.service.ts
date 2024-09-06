import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AppStateService } from '../../app-state.service';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class RoleGuardService {
  constructor(
    public appState: AppStateService,
    private authService: AuthService,
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // first check for login
    if (!this.authService.isAuthenticated) {
      this.authService.intendedPath = location.pathname;
      return false;
    }
    // so, the user is logged in - does she have a role that will allow her to do the navigation?
    // console.log(`checking permitted role: ${route.data.permittedRole} for route: ${route.pathFromRoot}`);
    if (!this.authService.canPerformRole(route.data.permittedRole)) {
      this.snackBar.open('No, you can not do that', null, {
        duration: this.appState.getState('errorMessageDuration'),
      });
      return false;
    }
    return true;
  }
}
