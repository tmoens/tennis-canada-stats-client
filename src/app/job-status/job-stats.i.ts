import { JobState } from './job.state';

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
