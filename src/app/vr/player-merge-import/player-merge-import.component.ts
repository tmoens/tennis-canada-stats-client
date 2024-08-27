import { Component, EventEmitter, OnInit } from '@angular/core';
import { JobStatusService } from '../../job-status/job-status.service';
import { AppStateService } from '../../app-state.service';
import {
  humanizeBytes,
  UploaderOptions,
  UploadFile,
  UploadInput,
  UploadOutput,
} from 'ngx-uploader';
import { environment } from '../../../environments/environment';
import { STATSTOOL } from '../../../assets/stats-tools';
import { AuthService } from '../../auth/auth.service';
import { JobState } from '../../job-status/job.state';
import { JobStats } from '../../job-status/job-stats';

const PLAYER_MERGE_ROUTE_ON_SERVER = '/Player/importVRPersonMergesCSV';

export enum PlayerMergeStatus {
  SUCCESS = 'Success',
  ALREADY_DONE = 'Already Done',
  CIRCULAR_RENUMBERING = 'Circular Renumbering',
  AMBIGUOUS_RENUMBERING = 'Ambiguous Renumbering',
  BAD_ID = 'Bad ID',
}

@Component({
  selector: 'app-player-merge-import',
  templateUrl: './player-merge-import.component.html',
  styleUrls: ['./player-merge-import.component.scss'],
})
export class PlayerMergeImportComponent implements OnInit {
  public expectedHeaders: string[] = [
    'fromPlayerId',
    'fromFirstName',
    'fromLastName',
    'toPlayerId',
    'toFirstName',
    'toLastName',
    'date',
  ];

  public notes: string[] = [
    'When Player IDs get merged in the VR system, the merge is not sent ' +
      'out via the VR API.  Instead we have to load the merge information here.',
    'We do two things a) we renumber historical data and b) we set it up ' +
      'so that if we encounter a merged Id in the future, we renumber it.',
  ];
  public step1: string[] = [
    'Create a simple Excel and Save As file type: CSV UTF-8 (Comma delimited) (*.csv)',
    'Columns must be: ' + this.expectedHeaders.join(', ') + '.',
    'Of these, only the fromPlayerId and the toPlayerId are absolutely required, ' +
      'the others are informational.',
  ];
  public tidyUp: string[] = [
    'The merge process is complete.',
    'While you can re-run the merges, they will have no further effect.',
    'You can delete the merge file, but it is probably a good idea to keep it for your records.',
  ];

  options: UploaderOptions;
  files: UploadFile[];
  file: UploadFile;
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: (bytes: number) => string;

  state: string;
  mergeStats: JobStats;
  allResults: PlayerMergeResult[] = [];
  canSelectFile: boolean;
  canUploadFile: boolean;
  canShowResults: boolean;

  possibleMergeResultTypes = [
    { name: PlayerMergeStatus.SUCCESS, description: '' },
    {
      name: PlayerMergeStatus.ALREADY_DONE,
      description: 'These merges were done sometime in the past',
    },
    {
      name: PlayerMergeStatus.AMBIGUOUS_RENUMBERING,
      description:
        'The "From player" was already renumbered to something else.',
    },
    {
      name: PlayerMergeStatus.CIRCULAR_RENUMBERING,
      description:
        'The reverse renumbering already exists - either directly or indirectly.',
    },
    {
      name: PlayerMergeStatus.BAD_ID,
      description: 'Player IDs must be 8 digits',
    },
  ];

  constructor(
    private jobStatusService: JobStatusService,
    private appState: AppStateService,
    private authService: AuthService
  ) {
    this.options = { concurrency: 1 };
    this.files = [];
    this.file = null;
    // input events, we use this to emit data to ngx-uploader
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.setState('not started');
    this.appState.setActiveTool(STATSTOOL.PLAYER_MERGE_IMPORTER);
    // When initializing, check if there is already an upload in progress
    // If so, just join in to get status updates.
    this.pollStatus();
  }

  pollStatus(): void {
    this.jobStatusService
      .getStatus(PLAYER_MERGE_ROUTE_ON_SERVER)
      .subscribe((data) => {
        this.mergeStats = data;
        if (this.mergeStats.status === JobState.IN_PROGRESS) {
          this.setState('processing');
          setTimeout(() => this.pollStatus(), 200);
        } else if (this.mergeStats.status === JobState.DONE) {
          this.allResults = this.mergeStats.data
            .allResults as PlayerMergeResult[];
          this.setState('done');
        }
      });
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
    } else if (
      output.type === 'addedToQueue' &&
      typeof output.file !== 'undefined'
    ) {
      this.file = output.file;
      this.setState('selected');
    } else if (
      output.type === 'uploading' &&
      typeof output.file !== 'undefined'
    ) {
      this.file = output.file;
      this.setState('uploading');
    } else if (output.type === 'removed') {
      this.file = null;
    } else if (
      output.type === 'rejected' &&
      typeof output.file !== 'undefined'
    ) {
      // console.log(output.file.name + ' rejected');
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
      url: environment.serverPrefix + PLAYER_MERGE_ROUTE_ON_SERVER,
      method: 'POST',
      headers: { Authorization: 'bearer ' + this.authService.accessToken },
      file: this.file,
      data: {},
    };
    this.setState('uploading');
    this.uploadInput.emit(event);
  }

  setState(state: string) {
    this.state = state;
    this.canSelectFile = !(
      'uploading' === this.state || 'processing' === this.state
    );
    this.canShowResults = 'done' === this.state || 'processing' === this.state;
    this.canUploadFile = this.state === 'selected';
  }
}

export interface PlayerMergeRecord {
  fromPlayerId: number;
  toPlayerId: number;
  fromLastName?: string;
  toLastName?: string;
  fromFirstName?: string;
  toFirstName?: string;
  date?: string;
}

export interface PlayerMergeResult {
  request: PlayerMergeRecord;
  notes: string[];
  status: PlayerMergeStatus;
  merges?: {
    matches?: number;
    ranking_entries?: number;
    event_entries?: number;
  };
}
