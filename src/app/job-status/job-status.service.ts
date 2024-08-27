import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { JobStats } from './job-stats';
import { HttpErrorHandlerService } from '../http-error-handler';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class JobStatusService {
  private serverURL = environment.serverPrefix;

  constructor(
    private http: HttpClient,
    private httpErrorHandlerService: HttpErrorHandlerService
  ) {}

  /* By my convention, if the job is at some route, the status of that job is
   * at the same route appended by '/status'
   */
  getStatus(jobRoute: string): Observable<JobStats> {
    const url = `${this.serverURL}${jobRoute}/status`;
    return this.http
      .get<JobStats>(url, httpOptions)
      .pipe(
        catchError(this.httpErrorHandlerService.handleError('Get User', null))
      );
  }
}
