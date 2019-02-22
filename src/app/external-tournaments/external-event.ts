import {ExternalTournament} from './external-tournament';

export class ExternalEvent {
  eventId: string;
  tournament: ExternalTournament;
  name: string;
  gender: string;
  eventType: string;
  discipline: string;
  drawSize:number;
  manuallyCreated: boolean;
  ignoreResults: boolean;
  numResults: number;
}
