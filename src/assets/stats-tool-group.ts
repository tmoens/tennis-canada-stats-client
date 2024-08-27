import {STATSTOOL} from './stats-tools';

export class StatsToolGroup {
  constructor(
    public readonly displayName: string,
    public readonly description: string,
    public tools: STATSTOOL[],
  ) {
  }
}

