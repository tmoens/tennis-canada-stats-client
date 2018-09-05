import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class JobStatusService {

  private serverURL = environment.serverPrefix;

  constructor(
    private http: HttpClient)
  { }


  /** GET: list of licenses with missing province */
  //TODO Handle error;
  getPlayerImportJobStatus():Observable<JobStats> {
    let url = `${this.serverURL}/Player/importVRPersonsCSV/status`;
    return this.http.get<JobStats>(url , httpOptions);
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
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}

export interface JobStats {
  name?: string;
  startTime?: Date;
  endTime?: Date;
  status: JobState;
  currentActivity?: string;
  message?: string;
  toDo?: number;
  // anything the client wants to remember about the job
  counters?: any;
  data?: any;
  percentComplete?: number;
}

export enum JobState {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
  ERROR = "Error",
}
