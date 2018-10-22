import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
// @ts-ignore
import {environment} from "../environments/environment";

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


  /* By my convention, if the job is at some route, the status of that job is
   * at the same route appended by '/status'
   */
  getStatus(jobRoute):Observable<JobStats> {
    let url = `${this.serverURL}${jobRoute}/status`;
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
  history?: string[];
  toDo?: number;
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
