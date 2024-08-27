import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginGuardService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated) {
      this.authService.intendedPath = location.pathname;
      this.router.navigateByUrl('/login').then();
      return false;
    }
    return true;
  }
}
