import {STATSTOOL} from './stats-tools';
import {USER_ROLE} from '../app/auth/app-roles';

export class StatsToolGroup {
  constructor(
    public readonly displayName: string,
    public readonly description: string,
    public tools: STATSTOOL[],
  ) {
  }
}

