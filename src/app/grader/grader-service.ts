import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { GradingFilter } from './grading-filter';
import { GradingDTO } from './grading-dto';
import { HttpErrorHandlerService } from '../http-error-handler';

const defaultHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable()
export class GraderService {
  private serverURL = environment.serverPrefix;

  constructor(
    private http: HttpClient,
    private httpErrorHandlerService: HttpErrorHandlerService
  ) {}

  getCurrentGradings(filter: GradingFilter): Observable<GradingDTO[]> {
    const options = { headers: defaultHeaders };
    let params: HttpParams = new HttpParams();
    const url = `${this.serverURL}/Tournament/getCurrentGradings`;
    let noFilters = true;
    Object.entries(filter).map((e) => {
      if (e[1] && e[0]) {
        noFilters = false;
        params = params.set(e[0], e[1]);
      }
    });
    if (!noFilters) {
      options['params'] = params;
    }

    return this.http.get<GradingDTO[]>(url, options);
  }

  setGrade(tournamentCode: string, approvedGrade: string) {
    const options = { headers: defaultHeaders };
    const url = `${this.serverURL}/tournament-grade-approval/create/${tournamentCode}/${approvedGrade}`;
    return this.http
      .post<GradingDTO | null>(url, {}, options)
      .pipe(
        catchError(
          this.httpErrorHandlerService.handleError(
            'Failed to set tournament grade.',
            null
          )
        )
      );
  }
}
