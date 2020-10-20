import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';

import {environment} from '../environments/environment';

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

export interface JobStatsI {
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
  getCounter(counterName: string): number;
}

export enum JobState {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
  ERROR = "Error",
}

/*
 * A very small object to track the status of long running jobs.
 * By keeping one of these up to date, the server can answer
 * client polling for the status of a job.
 *
 * Used for things like uploading big player spreadsheets
 * or building reports for the client.
 */
export class JobStats implements JobStatsI{
  name: string;
  startTime: Date;
  endTime: Date;
  status: JobState;
  currentActivity: string;
  history: string[] = [];
  toDo: number;
  data: any;
  counters: any = {};
  percentComplete?: number;

  constructor(name: string) {
    this.name = name;
    this.startTime = new Date();
    this.status = JobState.NOT_STARTED;
    this.toDo = -1; // If it is -1 it is not known yet.
  }

  bump(counterName: string, amount: number = 1): number {
    if (null == this.counters[counterName]) {
      this.counters[counterName] = amount;
    } else {
      this.counters[counterName] = this.counters[counterName] + amount;
    }
    if (counterName === 'done' && this.toDo > 0) {
      this.percentComplete = Math.trunc( (this.counters.done / this.toDo) * 100);
    }
    return this.counters[counterName];
  }

  getCounter(counterName: string): number {
    if (null == this.counters[counterName]) {
      return -1;
    } else {
      return this.counters[counterName];
    }
  }

  getCounters(): any {
    return this.counters;
  }

  setStatus(state: JobState) {
    this.status = state;
    this.endTime = new Date();
  }

  getHistory(): string[] {
    return this.history;
  }

  addNote(note: string) {
    this.history.push((new Date()).toISOString() + ' ' + note);
  }

  setCurrentActivity(activity: string) {
    this.currentActivity = activity;
    this.addNote(activity);
  }

  // Merge one set of stats with another
  // For now just add in the others history and counters.
  merge(other: JobStats) {
    this.history.concat(other.getHistory());
    const otherCounters = other.getCounters();
    for (const name of Object.keys(otherCounters)) {
      this.bump(name, otherCounters[name]);
    }
  }
}
