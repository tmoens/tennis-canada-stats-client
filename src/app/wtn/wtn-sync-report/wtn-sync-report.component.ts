import {Component, OnInit} from '@angular/core';
import {JobState, JobStats, JobStatusService} from '../../job-status.service';
import {AppStateService} from '../../app-state.service';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const SYNC_REPORT_PATH = '/WTN/wtnSyncReport';

@Component({
  selector: 'app-wtn-sync-report',
  templateUrl: './wtn-sync-report.component.html',
  styleUrls: ['./wtn-sync-report.component.css']
})
export class WtnSyncReportComponent implements OnInit {
  downloadUrl: string | null = null;
  JobState = JobState;
  jobStats: JobStats;

  public notes: string[] = [
    'Get a report on the associations between WTN Ids and Tennis Canada VR IDs. ',
  ];

  constructor(
    private jobStatusService: JobStatusService,
    private appState: AppStateService,
    private http: HttpClient,
    private authService: OktaAuthService, // this is needed to get the access token in the interceptor.
  ) {
    this.jobStats = new JobStats('?');
  }

  ngOnInit(): void {
    this.appState.setActiveTool('WTN Sync Report');
    // When initializing, check if there is already an upload in progress
    // If so, just join in to get status updates.
    this.pollStatus();
  }

  pollStatus(): void {
    this.jobStatusService.getStatus(SYNC_REPORT_PATH).subscribe(
      data => {
        this.jobStats = data;
        if (this.jobStats.status === JobState.IN_PROGRESS) {
          setTimeout(() => this.pollStatus(), 200);
        } else if (this.jobStats.status === JobState.DONE) {
          this.downloadUrl = environment.serverPrefix + '/downloadReport?filename=' + this.jobStats.data['filename'];
        }
      }
    );
  }

  buildReport() {
    this.downloadUrl = null;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    // when the request to build the report has been sent, start polling the server for status
    this.http.get<string>(environment.serverPrefix + SYNC_REPORT_PATH, httpOptions)
      .subscribe((res: any) => {
        this.pollStatus();
      });
  }

}
