import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from './auth/auth.service';
import {AppStateService} from './app-state.service';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class HttpErrorHandlerService {

  constructor(
    private http: HttpClient,
    private message: MatSnackBar,
    private authService: AuthService,
    private appState: AppStateService,
    private router: Router,
  ) {
  }

  /*
   * This generic handler was copied from the Angular tutorial.
   * And as a note to future, even thicker, self who will be going WTF?...
   * We use it to handle errors for all our http calls.  But all
   * our HTTP Calls return different types!  And the error handler
   * has to return the right type.  So, the error handler is
   * parameterized such that you can tell it what to return when
   * it is finished doing it's business.
   */
  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T | null> => {
      if (401 === error.status && this.authService.isAuthenticated) {
        this.message.open('Your session has ended unexpectedly',
          null, {duration: this.appState.getState('confirmMessageDuration')});
        this.authService.onLogout();
        this.router.navigateByUrl('/login').then();
      } else {
        this.message.open(operation + '. ' + error.error.message || error.status,
          null, {duration: this.appState.getState('confirmMessageDuration')});
      }
      // Let the app keep running by returning what we were told to.
      return of(result as T);
    };
  }
}
