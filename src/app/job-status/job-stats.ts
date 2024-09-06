/*
 * A very small object to track the status of long-running jobs.
 * By keeping one of these up to date, the server can answer
 * client polling for the status of a job.
 *
 * Used for things like uploading big player spreadsheets
 * or building reports for the client.
 */
import { JobStatsI } from './job-stats.i';
import { JobState } from './job.state';

export class JobStats implements JobStatsI {
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

  bump(counterName: string, amount = 1): number {
    if (null == this.counters[counterName]) {
      this.counters[counterName] = amount;
    } else {
      this.counters[counterName] = this.counters[counterName] + amount;
    }
    if (counterName === 'done' && this.toDo > 0) {
      this.percentComplete = Math.trunc((this.counters.done / this.toDo) * 100);
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

  getHistory(): string[] {
    return this.history;
  }

  // Merge one set of stats with another
  // For now just add in the other's history and counters.
  merge(other: JobStats) {
    this.history.concat(other.getHistory());
    const otherCounters = other.getCounters();
    for (const name of Object.keys(otherCounters)) {
      this.bump(name, otherCounters[name]);
    }
  }
}
