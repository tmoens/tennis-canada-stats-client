import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';
import {ResetPasswordDTO, UserDTO, UserPasswordChangeDTO} from './UserDTO';
import {AuthService} from './auth.service';
import {AppStateService} from '../app-state.service';
import {UserFilter} from './user-admin/user-filter';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private serverURL = environment.serverPrefix;

  constructor(
    private http: HttpClient,
    private message: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private appState: AppStateService,
  ) {
  }

  // ----------------------------- Login/Logout ------------------------------
  login(username: string, password: string) {
    return this.http.post(this.serverURL + '/user/login', {username, password})
      .pipe(
        catchError(this.handleError('Login failed', null))
      );
  }

  logout() {
    return this.http.post(this.serverURL + '/user/logout', {})
      .pipe(
        catchError(this.handleError('Logout failed', null))
      );
  }

  // ----------------------------- User Operations ------------------------------
  activate(user: UserDTO): Observable<UserDTO> {
    return this.http.put(this.serverURL + '/user/activate', user)
      .pipe(
        catchError(this.handleError('activate user', null))
      );
  }

  deactivate(user: UserDTO): Observable<UserDTO> {
    return this.http.put(this.serverURL + '/user/deactivate', user)
      .pipe(
        catchError(this.handleError('deactivate user', null))
      );
  }

  forceLogout(user: UserDTO): Observable<UserDTO> {
    return this.http.put(this.serverURL + '/user/forceLogout', user)
      .pipe(
        catchError(this.handleError('force logout', null))
      );
  }

  resetPassword(dto: ResetPasswordDTO): Observable<any> {
    return this.http.put(this.serverURL + '/user/resetPassword', dto)
      .pipe(
        catchError(this.handleError('Reset Password', null))
      );

  }

  passwordChange(dto: UserPasswordChangeDTO): Observable<UserDTO> {
    return this.http.put(this.serverURL + '/user/changePassword', dto)
      .pipe(
        catchError(this.handleError('Change Password', null))
      );

  }

  isEmailInUse(email: string): Observable<any> {
    return this.http.get(this.serverURL + '/user/isEmailInUse/' + email)
      .pipe(
        catchError(this.handleError('check email uniqueness', null))
      );
  }

  isUsernameInUse(email: string): Observable<any> {
    return this.http.get(this.serverURL + '/user/isUsernameInUse/' + email)
      .pipe(
        catchError(this.handleError('check username uniqueness', null))
      );
  }

  isNameInUse(email: string): Observable<any> {
    return this.http.get(this.serverURL + '/user/isNameInUse/' + email)
      .pipe(
        catchError(this.handleError('check user\'s name uniqueness', null))
      );
  }

  isInitialsInUse(email: string): Observable<any> {
    return this.http.get(this.serverURL + '/user/isInitialsInUse/' + email)
      .pipe(
        catchError(this.handleError('check initials uniqueness', null))
      );
  }

  // ----------------------------- User Admin Operations ------------------------------
  getInstance(id: string): Observable<any> {
    if (!id) {
      return of(null);
    }
    return this.http.get(this.serverURL + '/user/' + id)
      .pipe(
        catchError(this.handleError('Get user.', {}))
      );
  }

  getByName(name: string): Observable<any> {
    return this.http.get(this.serverURL + '/user/name/' + name)
      .pipe(
        catchError(this.handleError('Get user by name.', null))
      );
  }

  getUsers(filter: UserFilter): Observable<any> {
    const q = convertObjectToHTTPQueryParams(filter);
    return this.http.get(this.serverURL + '/user' +  q)
      .pipe(
        catchError(this.handleError('Get User' + '.', []))
      );
  }

  getUsersByType(userType: string): Observable<any> {
    return this.http.get(this.serverURL + '/user/findUsers/' + userType)
      .pipe(
        catchError(this.handleError('Get researchers' + '.', []))
      );
  }


  delete(id: number | string) {
    return this.http.delete(this.serverURL + '/user/' + id)
      .pipe(
        catchError(this.handleError('Delete user.', null))
      );
  }

  create(user: UserDTO) {
    return this.http.post(this.serverURL + '/user/', user)
      .pipe(
        catchError(this.handleError('Create user failed.', null))
      );
  }

  update(user: UserDTO) {
    return this.http.put(this.serverURL + '/user/', user)
      .pipe(
        catchError(this.handleError('Update user.', null))
      );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  /*
   * This generic handler was copied from the Angular tutorial.
   * And as a note to future, even thicker, self who will be going WTF?...
   * We use it to handle errors for all our http calls.  But all
   * our HTTP Calls return different types!  And the error handler
   * has to return the right type.  So, the error handler is
   * parameterized such that you can tell it what to return when
   * it is finished doing it's business.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T | null> => {
      if (401 === error.status && this.authService.isAuthenticated) {
        this.message.open('Your session has ended unexpectedly',
          null, {duration: this.appState.getState('confirmMessageDuration')});
        this.authService.onLogout();
        this.router.navigateByUrl('/login');
      } else {
        this.message.open(operation + '. ' + error.error.message || error.status,
          null, {duration: this.appState.getState('confirmMessageDuration')});
      }
      // Let the app keep running by returning what we were told to.
      return of(result as T);
    };
  }

}

// this assumes that the params are scalar. Which they are.
function convertObjectToHTTPQueryParams(params: any) {
  const paramArray: string[] = [];
  Object.keys(params).forEach(key => {
    if (params[key]) {
      paramArray.push(key + '=' + params[key]);
    }
  });
  if (paramArray.length > 0) {
    return '?' + paramArray.join('&');
  }  else {
    return '';
  }
}
