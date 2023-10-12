import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {AppStateService} from '../app-state.service';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {STATSTOOL} from '../../assets/stats-tools';
import {JobState, JobStats, JobStatusService} from '../job-status.service';

const REPORT_REQUEST_URL = '/Exports/MatchCompetitivenessReport';

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
  requestStatus: JobStats;

  constructor(
    private appState: AppStateService,
    private http: HttpClient,
    private jobStatusService: JobStatusService,
  ) {
    this.today = new Date();
  }

  ngOnInit() {
    this.appState.setActiveTool(STATSTOOL.MATCH_COMPETITIVENESS_REPORTER);
    // When initializing, check if there is already an upload in progress
    // If so, just join in to get status updates.
    this.pollStatus();
  }

  buildReport() {
    this.state.buildingReport = true;
    this.state.reportReady = false;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    // When the query string is built, send it to the server and the server
    // send back a string with a file name where the file can be downloaded.
    this.http.get<string>(`${environment.serverPrefix}${REPORT_REQUEST_URL}/build`, httpOptions)
      .subscribe(() => {
        this.pollStatus();
      });
  }

  pollStatus(): void {
    this.jobStatusService.getStatus(`${REPORT_REQUEST_URL}/build`).subscribe(
      data => {
        this.requestStatus = data;
        if (this.requestStatus.status === JobState.IN_PROGRESS  ) {
          this.state.buildingReport = true;
          this.state.reportReady = false;
          setTimeout(() => this.pollStatus(), 200);
        } else if (this.requestStatus.status === JobState.DONE) {
          this.state.buildingReport = false;
          if (this.requestStatus.data.filename) {
            this.state.reportReady = true;
            this.downloadURL = `${environment.serverPrefix}${REPORT_REQUEST_URL}/download?filename=${this.requestStatus.data.filename}`;
          } else {
            // If the job is finished, there should be a filename. But just in case, fail silently.
            this.state.reportReady = false;
          }
        } else {
          this.state.reportReady = false;
          this.state.buildingRatings = false;
        }
      }
    );
  }
}
