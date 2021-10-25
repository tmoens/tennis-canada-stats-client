import {Component, EventEmitter, OnInit} from '@angular/core';
import {humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput} from 'ngx-uploader';
import {JobState, JobStats, JobStatusService} from '../../job-status.service';
import {AppStateService} from '../../app-state.service';
import {environment} from '../../../environments/environment';
import {STATSTOOL} from '../../../assets/stats-tools';
import {AuthService} from '../../auth/auth.service';

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

const PLAYER_CHECK_ROUTE_ON_SERVER = '/Player/check';

@Component({
  selector: 'app-player-import',
  templateUrl: './player-check.component.html',
  styleUrls: ['./player-check.component.scss']
})

export class PlayerCheckComponent implements OnInit {
  public notes: string[] = [
    'The Player Checker tries to find a VR Id for a player based on partial ' +
      'information about that player.  The better the information, the more likely ' +
      'the checker is to find a good match.',
    'The main application of this is to validate club membership lists in BC.'
  ];
  public step1: string[] = [
    'Create a workbook (with as many worksheets as you like)',
    'Each sheet must have the a header row (case sensitive, order unimportant). ',
    'Empty worksheets will cause the import to fail.',
    'Different Sheets can have different columns in different orders.',
    'Required Columns: FirstName, LastName, MemberId, ClubNumber (VR Club Code for membership)',
    'Additional columns make for better matches:',
    'Birthdate - format must be YYYY-MM-DD',
    'Gender - M, or Male, F or Female',
    'Address - street address like 2137 Main Street',
    'PostalCode',
    'City',
    'Province - proper two letter abbreviation',
    'Email',
    'HomePhone - pretty much any format will do',
    'MobilePhone',
    'Phone3',
    'It is not necessary to have data in any columns except LastName, ' +
    'but don\'t count on good matches if you do not.'
  ];
  public step3: string[] = [
    'The main use of this is to validate club membership lists in BC' ,
    'Presuming the input was good, you will get an marked up version of your file back. ' +
    'You probably need to do some work on this file.',
    'If you provided a Player ID with a non matching last name, you need to look into why this is.',
    'If you provided a player with no memberId, you will probably want to choose the right one ' +
      'from the set of options provided.',
    'After that, you will want to delete all the extraneous rows and create a spreadsheet for ' +
      'VR membership renewal.',
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
  canDownloadReport: boolean;
  downloadURL: string;

  constructor(
      private jobStatusService: JobStatusService,
      private appState: AppStateService,
      private authService: AuthService,
    ) {
    this.options = { concurrency: 1};
    this.files = [];
    this.file = null;
    // input events, we use this to emit data to ngx-uploader
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.appState.setActiveTool(STATSTOOL.PLAYER_CHECK);
    // When initializing, check if there is already an upload in progress
    // If so, just join in to get status updates.
    this.jobStatusService.getStatus(PLAYER_CHECK_ROUTE_ON_SERVER).subscribe(
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
    // console.log(JSON.stringify(output));
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
      url: serverURL + PLAYER_CHECK_ROUTE_ON_SERVER,
      headers: { 'Authorization': 'bearer ' + this.authService.accessToken },
      method: 'POST',
      file: this.file,
      data: { }
    };
    this.setState('uploading');
    this.uploadInput.emit(event);
  }

  pollStatus(): void {
    this.jobStatusService.getStatus(PLAYER_CHECK_ROUTE_ON_SERVER).subscribe(
      data => {
        this.importStatus = data;
        if (this.importStatus.status === JobState.IN_PROGRESS  ) {
          this.setState('processing');
          setTimeout(() => this.pollStatus(), 200);
        } else if (this.importStatus.status === JobState.DONE) {
          this.setState('downloadAvailable');
          this.downloadURL =  environment.serverPrefix + '/player/check/downloadReport?filename=' + this.importStatus.data.filename;
        }
      }
    );
  }

  setState(state: string) {
    this.state = state;
    this.canSelectFile = !('uploading' === this.state || 'processing' === this.state);
    this.canUploadFile = this.state === 'selected';
    this.canDownloadReport = this.state === 'downloadAvailable';
  }
}
