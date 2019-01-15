import {ExternalTournament} from "../tournament-detail-editor/external-tournament";
import {EventRating} from "../rating-service.service";

export class ExternalEvent {
  eventId: string;
  tournament: ExternalTournament;
  name: string;
  gender: string;
  eventType: string;
  discipline: string;
  drawSize:number;
  rating: EventRating;
  manuallyCreated: boolean;
  ignoreResults: boolean;
  numResults: number;
}
