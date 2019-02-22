// A custom filter for results from international tournament results.
export class TournamentFilter {
  tournamentName: string = null;
  gender: string;
  sanctioningBody: string = null;
  category: string = null;
  startPeriod: string;
  endPeriod: string;
  sortOrder: number; // not used yet
}
