import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {GradingFilter} from './grading-filter';
import {GradingDTO} from './grading-dto';
import {HttpErrorHandlerService} from '../http-error-handler';

const defaultHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable()
export class GraderService {

  private serverURL = environment.serverPrefix;

  constructor(
    private http: HttpClient,
    private httpErrorHandlerService: HttpErrorHandlerService,
  ) { }


  getCurrentGradings(filter: GradingFilter): Observable<GradingDTO[]> {
    const options = { headers: defaultHeaders };
    let params: HttpParams = new HttpParams();
    const url = `${this.serverURL}/Tournament/getCurrentGradings`;
    let noFilters = true;
    Object.entries(filter).map(e => {
      if (e[1] && e[0]) {
        noFilters = false;
        params = params.set(e[0], e[1]);
      }
    });
    if (!noFilters) {
      options['params'] = params;
    }

    return this.http.get<GradingDTO[]>(url , options);
  }

  setGrade(tournamentCode: string, approvedGrade: string) {
    const options = { headers: defaultHeaders };
    const url = `${this.serverURL}/tournament-grade-approval/create/${tournamentCode}/${approvedGrade}`;
    return this.http.post<GradingDTO | null>(url, {}, options)
      .pipe(
        catchError(this.httpErrorHandlerService.handleError('Failed to set tournament grade.', null))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  private log(message: string) {
    console.log('ExternalTournamentService: ' + message);
  }

}
