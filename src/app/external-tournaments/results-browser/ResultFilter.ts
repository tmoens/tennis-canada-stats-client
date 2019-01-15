// A custom filter for results from international tournaments.
export class ResultFilter {
  playerId: string = null;
  VRID: string = null;
  lastName: string = null;
  tournamentName: string = null;
  sanctioningBody: string = null;
  category: string = null;
  subCategory: string = null;
  start:string;
  end:string;
  // sort order 1 = Player Name/EndDate, 2 = EndDate/Tournament Name/Player Name
  sortOrder:number;
}
