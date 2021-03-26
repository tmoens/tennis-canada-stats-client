import {Component, EventEmitter, OnInit} from '@angular/core';
import {humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput} from 'ngx-uploader';
import {JobState, JobStats, JobStatusService} from '../../job-status.service';
import {AppStateService} from '../../app-state.service';
import {OktaAuthService} from '@okta/okta-angular';
import {environment} from '../../../environments/environment';

const ROUTE_ON_SERVER = '/Player/uploadWtnIdCSV';

export enum WtnUploadStatus {
  SUCCESS = 'Success',
  ALREADY_DONE = 'Already Done',
  WTN_CHANGED = 'WTN Changed',
  BAD_VR_ID = 'Bad VR ID',
  FAIL = 'Fail',
}

@Component({
  selector: 'app-load-wtn-ids',
  templateUrl: './load-wtn-ids.component.html',
  styleUrls: ['./load-wtn-ids.component.css']
})
export class LoadWtnIdsComponent implements OnInit {

  public expectedHeaders: string[] = ['vrId', 'lastName', 'firstName', 'wtnId'];

  public notes: string[] = [
    'Load WTN Ids for VR players.  This assumes the matching has been done carefully.'
  ];
  public step1: string[] = [
    'Create a simple Excel and Save As file type: CSV UTF-8 (Comma delimited) (*.csv)',
    'Columns must be: ' + this.expectedHeaders.join(', ') + '.',
  ];

  public tidyUp: string[] = ['The upload process is complete.',
    'While you can re-run the upload, it will have no further effect.',
    'You can delete the upload file, but it is probably a good idea to keep it for your records.'];

  options: UploaderOptions;
  files: UploadFile[];
  file: UploadFile;
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;

  state: string;
  uploadStats: JobStats;
  allResults: WtnUploadResult[] = [];
  canSelectFile: boolean;
  canUploadFile: boolean;
  canShowResults: boolean;

  possibleResultTypes = [
    {name: WtnUploadStatus.SUCCESS,
      description: '',
      displayDetails: false},
    {name: WtnUploadStatus.ALREADY_DONE,
      description: 'WTN ID already uploaded',
      displayDetails: false},
    {name: WtnUploadStatus.WTN_CHANGED,
      description: 'Chnaged the WTN ID',
      displayDetails: true},
    {name: WtnUploadStatus.BAD_VR_ID,
      description: 'VR playerID unknown',
      displayDetails: true},
    {name: WtnUploadStatus.FAIL,
      description: 'Failure',
      displayDetails: true},
  ];

  constructor(
    private jobStatusService: JobStatusService,
    private appState: AppStateService,
    private auth: OktaAuthService,
  ) {
    this.options = { concurrency: 1};
    this.files = [];
    this.file = null;
    // input events, we use this to emit data to ngx-uploader
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;

  }

  ngOnInit() {
    this.setState('not started');
    this.appState.setActiveTool('WTN ID Upload');
    // When initializing, check if there is already an upload in progress
    // If so, just join in to get status updates.
    this.pollStatus();
  }

  pollStatus(): void {
    this.jobStatusService.getStatus(ROUTE_ON_SERVER).subscribe(
      data => {
        this.uploadStats = data;
        if (this.uploadStats.status === JobState.IN_PROGRESS) {
          this.setState('processing');
          setTimeout(() => this.pollStatus(), 200);
        } else if (this.uploadStats.status === JobState.DONE) {
          this.allResults = this.uploadStats.data.allProblems as WtnUploadResult[];
          this.setState('done');
        }
      }
    );
  }

  openFileChooser() {
    document.getElementById('fileToUpload').click();
  }

  // Handle events issued by the file uploader - mostly the upload progress.
  /* Note to future self: Every time you select a file, it gets pushed into the
   * upload queue (that is what ngx-uploader does).  So if you select a file then
   * select a different one, they are both in the queue.
   *
   * So what? Well when the user decides to do the upload, it is best if you
   * send the "uploadFile" event with the last file chosen, and not the
   * "uploadAll" event, which will send every file the user had selected
   * at any point.
   */
  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      // could call startUpload to upload automatically here
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.file = (output.file);
      this.setState('selected');
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      this.file = output.file;
      this.setState('uploading');
    } else if (output.type === 'removed') {
      this.file = null;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    } else if (output.type === 'done') {
      this.file = output.file;
      if (this.file.responseStatus !== 201) {
        this.setState('error');
        return;
      }
      // Once the file is uploaded, we can start polling the server to
      // see how the import is progressing.
      this.pollStatus();
    }
  }

  async startUpload(): Promise<any | null> {
    const event: UploadInput = {
      type: 'uploadFile',
      url: environment.serverPrefix + ROUTE_ON_SERVER,
      method: 'POST',
      headers: { 'Authorization': 'bearer ' + await this.auth.getAccessToken() },
      file: this.file,
      data: { }
    };
    this.setState('uploading');
    this.uploadInput.emit(event);
  }

  setState(state: string) {
    this.state = state;
    this.canSelectFile = !('uploading' === this.state || 'processing' === this.state);
    this.canShowResults = ('done' === this.state || 'processing' === this.state);
    this.canUploadFile = this.state === 'selected';
  }
}

export interface WtnUploadRecord {
  vrId: number;
  firstName: string;
  lastName: string;
  wtnId: number;
}

export interface WtnUploadResult {
  request: WtnUploadRecord;
  description: string[];
  status: WtnUploadStatus;
}


