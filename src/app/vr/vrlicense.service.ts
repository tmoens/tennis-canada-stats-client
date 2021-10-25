import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VRLicense} from './vrlicense-manager/VRLicense';
import {AppStateService} from '../app-state.service';
import {catchError} from 'rxjs/operators';
import {HttpErrorHandlerService} from '../http-error-handler';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VRLicenseService {
  private readonly serverURL: string;

  constructor(
    private http: HttpClient,
    private httpErrorHandlerService: HttpErrorHandlerService,
    private appState: AppStateService,
  ) {
    this.serverURL = this.appState.getState('serverPrefix');
  }

  /** POST: a list of licenses with provinces */
  updateLicensesWithMissingProvince(licenses: VRLicense[]): Observable<VRLicense[]> {
    const url = `${this.serverURL}/license/fixLicensesWithoutProvinces`;
    return this.http.post<VRLicense[]>(url , licenses, httpOptions)
      .pipe(
        catchError(this.httpErrorHandlerService.handleError('Failed: update VR Licenses.', []))
      );
  }

  /** GET: list of licenses with missing province */
  getLicensesWithMissingProvince(): Observable<VRLicense[]> {
    const url = `${this.serverURL}/license/missingProvince`;
    return this.http.get<VRLicense[]>(url , httpOptions)
      .pipe(
        catchError(this.httpErrorHandlerService.handleError('Failed: get licenses with missing provinces.', []))
      );
  }
}
