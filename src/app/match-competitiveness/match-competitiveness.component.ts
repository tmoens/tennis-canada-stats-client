import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {AppStateService} from '../app-state.service';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {STATSTOOL} from '../../assets/stats-tools';

@Component({
  selector: 'app-match-competitiveness',
  templateUrl: './match-competitiveness.component.html',
  styleUrls: ['./match-competitiveness.component.scss'],
})
export class MatchCompetitivenessComponent implements OnInit {
  state: any  = { buildingReport: false, reportReady: false};
  result = 'no result';
  downloadURL: string;
  today: Date;


  constructor(
    private appState: AppStateService,
    private http: HttpClient) {
    this.today = new Date();

  }

  ngOnInit() {
    this.appState.setActiveTool(STATSTOOL.MATCH_COMPETITIVENESS_REPORTER);
  }

  // Construct the URL which is used to build the report.
  buildReportURL(): string {
    return environment.serverPrefix + '/Exports/MatchCompetitivenessReport';
  }

  buildReport() {
    this.state.buildingReport = true;
    this.state.reportReady = false;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    // When the query string is built, send it to the server and the server
    // send back a string with a file name where the file can be downloaded.
    this.http.get<string>(this.buildReportURL(), httpOptions)
      .subscribe((res: any) => {
        console.log(JSON.stringify(res, null, 2));
        this.downloadURL = environment.serverPrefix + '/Exports/downloadMatchCompetitivenessReport?filename=' + res.data.filename;
        this.state.buildingRatings = false;
        this.state.reportReady = true;
      });
  }
}
