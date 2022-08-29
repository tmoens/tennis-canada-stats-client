// A DTO holding information about the current and approved grade for a league or tournament.
export class GradingDTO {
  name: string;
  tournamentCode: string;
  type: string; // Tournament or League
  vrGrade: string;
  approvedGrade: string;
  endDate: string;
}
