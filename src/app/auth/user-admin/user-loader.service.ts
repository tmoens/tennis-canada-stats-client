import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError} from 'rxjs/operators';
import {AppStateService} from '../../app-state.service';
import {AuthService} from '../auth.service';
import {UserFilter} from './user-filter';
import {UserDTO} from '../UserDTO';
import {HttpErrorHandlerService} from '../../http-error-handler';

@Injectable({
  providedIn: 'root'
})
export class UserLoaderService {
  private readonly serverURL: string;

  constructor(
    private http: HttpClient,
    private message: MatSnackBar,
    private authService: AuthService,
    private appState: AppStateService,
    private httpErrorHandlerService: HttpErrorHandlerService,
  ) {
    this.serverURL = this.appState.getState('serverPrefix');
  }


  getFilteredList(filter: UserFilter): Observable<any> {
    if (!filter) {
      filter = new UserFilter();
    }
    const q = convertObjectToHTTPQueryParams(filter);
    return this.http.get(`${this.serverURL}/user${q}`)
      .pipe(
        catchError(this.httpErrorHandlerService.handleError('Get filtered user list.', []))
      );
  }

  getInstance(id: any): Observable<any> {
    if (!id) {
      return of({});
    }
    return this.http.get(`${this.serverURL}/user${id.toString()}`)
      .pipe(
        catchError(this.httpErrorHandlerService.handleError('Get user instance.', {}))
      );
  }

  getByName(name: string): Observable<any> {
    return this.http.get(`${this.serverURL}/user/name/${name}`)
      .pipe(
        catchError(this.httpErrorHandlerService.handleError('Get user by name.', null))
      );
  }

  delete(id: number | string) {
    return this.http.delete(`${this.serverURL}/user/id/${id}`)
      .pipe(
        catchError(this.httpErrorHandlerService.handleError('Delete user.', null))
      );
  }

  create(userDto: UserDTO) {
    return this.http.post(`${this.serverURL}/user/`, userDto)
      .pipe(
        catchError(this.httpErrorHandlerService.handleError('Create user failed.', null))
      );
  }

  update(userDto: UserDTO) {
    return this.http.put(`${this.serverURL}/user`, userDto)
      .pipe(
        catchError(this.httpErrorHandlerService.handleError('Update user', null))
      );
  }
}

// this assumes that the params are scalar. Which they are.
export function convertObjectToHTTPQueryParams(params: any) {
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
