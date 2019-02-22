export class ExternalTournament {
  tournamentId: string;
  name: string;
  zone: string;
  hostNation: string;
  sanctioningBody: string;
  category: string;
  subCategory: string;
  startDate: string;
  endDate: string;
  subCategoryEditable:boolean;

  makeURL(): string {
    let url = "http://www.google.ca";
    switch (this.sanctioningBody) {
      case "ATP":
        url = 'https://www.atptour.com/en/scores/results-archive?year=' +
          "year/" + this.startDate.substr(0, 4);
        break;
      case "WTA":
        url = "http://www.wtatennis.com/calendar/" +
          "year/" + this.startDate.substr(0, 4) +
          "month/" + this.startDate.substr(5, 2);
        break;
      case "ITF":
        switch (this.tournamentId.substr(0, 1)) {
          case 'W':
            url = "http://www.itftennis.com/procircuit/tournaments/women's-calendar.aspx?" +
              "nat=" + this.hostNation +
              "&fromDate=" + this.startDate.substr(0, 10) +
              "&toDate=" + this.endDate.substr(0, 10);
            break;
          case 'M':
            url = "http://www.itftennis.com/procircuit/tournaments/men's-calendar.aspx?" +
              "nat=" + this.hostNation +
              "&fromDate=" + this.startDate.substr(0, 10) +
              "&toDate=" + this.endDate.substr(0, 10);
            break;
          case'J':
          default:
            url = "http://www.itftennis.com/juniors/tournaments/calendar.aspx?" +
              "nat=" + this.hostNation +
              "&fromDate=" + this.startDate.substr(0,10) +
              "&toDate=" + this.endDate.substr(0,10);
        }
    }
    return url;
  }
}
