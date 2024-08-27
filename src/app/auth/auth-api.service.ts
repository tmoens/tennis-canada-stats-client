import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { ResetPasswordDTO, UserDTO, UserPasswordChangeDTO } from './UserDTO';
import { AuthService } from './auth.service';
import { AppStateService } from '../app-state.service';
import { HttpErrorHandlerService } from '../http-error-handler';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private serverURL = environment.serverPrefix;

  constructor(
    private http: HttpClient,
    private message: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private appState: AppStateService,
    private httpErrorHandlerService: HttpErrorHandlerService
  ) {}

  // ----------------------------- Login/Logout ------------------------------
  login(username: string, password: string) {
    return this.http
      .post(this.serverURL + '/user/login', { username, password })
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError('Login failed', null)
        )
      );
  }

  logout() {
    return this.http
      .post(this.serverURL + '/user/logout', {})
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError('Logout failed', null)
        )
      );
  }

  // ----------------------------- User Operations ------------------------------
  activate(user: UserDTO): Observable<UserDTO> {
    return this.http
      .put(this.serverURL + '/user/activate', user)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError('activate user', null)
        )
      );
  }

  deactivate(user: UserDTO): Observable<UserDTO> {
    return this.http
      .put(this.serverURL + '/user/deactivate', user)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError('deactivate user', null)
        )
      );
  }

  forceLogout(user: UserDTO): Observable<UserDTO> {
    return this.http
      .put(this.serverURL + '/user/forceLogout', user)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError('force logout', null)
        )
      );
  }

  resetPassword(dto: ResetPasswordDTO): Observable<any> {
    return this.http
      .put(this.serverURL + '/user/resetPassword', dto)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError('Reset Password', null)
        )
      );
  }

  passwordChange(dto: UserPasswordChangeDTO): Observable<UserDTO> {
    return this.http
      .put(this.serverURL + '/user/changePassword', dto)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError('Change Password', null)
        )
      );
  }

  isEmailInUse(email: string): Observable<any> {
    return this.http
      .get(this.serverURL + '/user/isEmailInUse/' + email)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError(
            'check email uniqueness',
            null
          )
        )
      );
  }

  isUsernameInUse(email: string): Observable<any> {
    return this.http
      .get(this.serverURL + '/user/isUsernameInUse/' + email)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError(
            'check username uniqueness',
            null
          )
        )
      );
  }

  isNameInUse(email: string): Observable<any> {
    return this.http
      .get(this.serverURL + '/user/isNameInUse/' + email)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError(
            "check user's name uniqueness",
            null
          )
        )
      );
  }

  // ----------------------------- User Admin Operations ------------------------------
  getInstance(id: string): Observable<any> {
    if (!id) {
      return of(null);
    }
    return this.http
      .get(this.serverURL + '/user/' + id)
      .pipe(
        catchError(this.httpErrorHandlerService.handleError('Get user.', {}))
      );
  }

  getUsers(): Observable<any> {
    return this.http
      .get(this.serverURL + '/user')
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError('Get User' + '.', [])
        )
      );
  }

  delete(id: number | string) {
    return this.http
      .delete(this.serverURL + '/user/' + id)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError('Delete user.', null)
        )
      );
  }

  create(user: UserDTO) {
    return this.http
      .post(this.serverURL + '/user/', user)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError('Create user failed.', null)
        )
      );
  }

  update(user: UserDTO) {
    return this.http
      .put(this.serverURL + '/user/', user)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError('Update user.', null)
        )
      );
  }
}
