export class ExternalEventResultDTO {
  // Event Information
  eventId: string;
  eventType: string;
  eventGender: string;
  eventDiscipline: string;

  // Tournament Information
  tournamentName: string;
  sanctioningBody: string;
  endDate: string;
  tournamentType: string;
  drawSize: number;

  // Points and Ranking
  finishPosition: number;
  externalRankingPoints: number;
  manualPointAllocation: number;
  tcPoints: string;
  pointsCategory: string;
  shortPointsCategory: string;

  // Player Information
  playerName: string;
  yob: number;
  externalId: string;
  internalId: number;
}
