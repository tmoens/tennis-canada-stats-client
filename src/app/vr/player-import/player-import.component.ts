import {Component, EventEmitter, OnInit} from '@angular/core';
import {humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput} from 'ngx-uploader';
import {JobState, JobStats, JobStatusService} from '../../job-status.service';
import {AppStateService} from '../../app-state.service';
import {OktaAuthService} from '@okta/okta-angular';
import {environment} from '../../../environments/environment';

/* Note to self about the ngx-uploader 2018-10-05 on account of it having no
 * documentation.  The uploader maintains a queue of files which gets
 * built by a <input type=file ngFileSelect> in your html.
 *
 * You communicate with the uploader by a) fielding events it sends you
 * (see onUploadOutput()) and sending events to it (see uploadInput.emit()).
 *
 * All I really bought with this is a nice progress bar for the process of
 * uploading the big VR "All Persons" report.
 */

const PLAYER_IMPORT_ROUTE_ON_SERVER = '/Player/importVRPersonsCSV';

@Component({
  selector: 'app-player-import',
  templateUrl: './player-import.component.html',
  styleUrls: ['./player-import.component.scss']
})

export class PlayerImportComponent implements OnInit {
  public notes: string[] = [
    'The VR loader automatically pulls in players from ' +
    'the VR API whenever a new player is encountered. ' +
    'However, the API provides only minimal information for each player.',
    'The VR Player Importer retrieves more complete and up to date ' +
    'information like phone numbers and addresses for all players.',
    'This takes a long time, but it should be done every month or so.'
  ];
  public step1: string[] = [
    'Log in to VR as an Tennis Canada Organization Admin and ' +
    'navigate to the admin reports.',
    'Run the "All persons" report using "Export XLSX". ' +
    'DO NOT use "Export CLI".',
    'Open the downloaded file and enable editing. ' +
    'Make sure that the column called "dob" is in "YYYY-MM-DD" format.  ' +
    'If not, you must convert it accordingly.  Failure to do so, will cause problems. ' +
    'It is probably best if you set "YYYY-MM-DD" as your default date format.',
    'IMPORTANT: save the file with the type: CSV UTF-8 (Comma delimited) (*.csv) ' +
    'The UTF-8 is critical or else all of accented characters will ' +
    'become garbled in the player database.',
    'Save and close the file. ',
    'Once you have done all of this, move to the next step.'
  ];
  public step3: string[] = [
    'Please delete the .xlsx file you downloaded from VR.',
    'Please delete the .csv file you saved',
    '(you have a lot of personal information on your computer which should not stay around).'
  ];

  options: UploaderOptions;
  files: UploadFile[];
  file: UploadFile;
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;

  state: string;
  importStatus: JobStats;
  canUploadFile: boolean;
  canSelectFile: boolean;

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
    this.appState.setActiveTool('Player Importer');
    // When initializing, check if there is already an upload in progress
    // If so, just join in to get status updates.
    this.jobStatusService.getStatus(PLAYER_IMPORT_ROUTE_ON_SERVER).subscribe(
      data => {
        this.importStatus = data;
        if (this.importStatus.status === JobState.IN_PROGRESS  ) {
          this.pollStatus();
        } else {
          this.setState('not started');
        }
      }
    );
  }

  /* Note to future self that cost me about three hours 2018-10-05.
   * This next bit is a work-around for the fact that angular buttons do not
   * mix well with <input type=file>, so the html has an angular button and
   * a hidden <input type=file>. When the button is pushed it calls this
   * function which programmatically clicks the file chooser which results
   * in the file chooser showing up.
   * Further note to self - if the Angular button label uses the
   * label-for="fileToUpload" attribute, then the Chrome browser is smart
   * enough to know what you are trying to do and it automatically pops up the
   * file chooser - meaning that it shows up twice.  Firefox is not so smart.
   * So do not use the label-for and both browsers work.
   */
  /* Note: in spite of what tslint says, this breaks if made static */
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
    console.log(JSON.stringify(output));
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
    const serverURL: string = environment.serverPrefix;
    const event: UploadInput = {
      type: 'uploadFile',
      url: `${serverURL}/Player/importVRPersonsCSV`,
      method: 'POST',
      headers: { 'Authorization': 'bearer ' + await this.auth.getAccessToken() },
      file: this.file,
      data: { }
    };
    this.setState('uploading');
    this.uploadInput.emit(event);
  }

  pollStatus(): void {
    this.jobStatusService.getStatus(PLAYER_IMPORT_ROUTE_ON_SERVER).subscribe(
      data => {
        this.importStatus = data;
        if (this.importStatus.status === JobState.IN_PROGRESS  ) {
          this.setState('processing');
          setTimeout(() => this.pollStatus(), 200);
        } else if (this.importStatus.status === JobState.DONE) {
          this.setState('done');
        }
      }
    );
  }

  setState(state: string) {
    this.state = state;
    this.canSelectFile = !('uploading' === this.state || 'processing' === this.state);
    this.canUploadFile = this.state === 'selected';
  }
}
