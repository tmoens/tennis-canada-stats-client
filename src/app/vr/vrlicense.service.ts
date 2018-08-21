import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {MessageService} from "../messages/message.service";
import {Observable, of} from "rxjs/index";
import {VRLicense} from "./vrlicense-manager/VRLicense";
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VRLicenseService {
  private serverURL = environment.serverPrefix;

  constructor(
    private http: HttpClient,
    private messageService: MessageService)
  { }

  /** POST: a list of licenses with provinces */
  //TODO Handle error;
  updateLicensesWithMissingProvince(licenses:VRLicense[]):Observable<VRLicense[]> {
    let url = `${this.serverURL}/license/fixLicensesWithoutProvinces`;
    return this.http.post<VRLicense[]>(url , licenses, httpOptions);
  }

  /** GET: list of licenses with missing province */
  //TODO Handle error;
  getLicensesWithMissingProvince():Observable<VRLicense[]> {
    let url = `${this.serverURL}/license/missingProvince`;
    return this.http.get<VRLicense[]>(url , httpOptions);
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
    this.messageService.add('LicenseService: ' + message);
  }

}
