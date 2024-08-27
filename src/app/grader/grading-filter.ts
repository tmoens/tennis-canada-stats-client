import { TournamentCategory } from './tournament-category-enum';

export class GradingFilter {
  tournamentCategory: string = TournamentCategory.Leagues;
  showAll = false;
  since: string = null;
}
