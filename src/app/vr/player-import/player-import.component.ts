import {Component, EventEmitter, OnInit} from '@angular/core';
import {humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput, UploadStatus} from "ngx-uploader";
import {JobState, JobStats, JobStatusService} from "../../job-status.service";
import {AppStateService} from "../../app-state.service";

@Component({
  selector: 'app-player-import',
  templateUrl: './player-import.component.html',
  styleUrls: ['./player-import.component.css']
})
export class PlayerImportComponent implements OnInit {
  fileToUpload:File = null;
  public notes:string[] = [
    "The VR loader automatically pulls in players from " +
    "the VR API whenever a new player is encountered. " +
    "However, the API provides only minimal information for each player.",
    "The VR Player Importer retrieves more complete and up to date " +
    "information like phone numbers and addresses for all players.",
    "This takes a long time, but it should be done every month or so."
  ];
  public step1:string[] = [
    "Log in to VR as an Tennis Canada Organization Admin and " +
    "navigate to the admin reports.",
    "Run the \"All persons\" report using \"Export XLSX\". " +
    "DO NOT use \"Export CLI\".",
    "Open the downloaded file and enable editing. " +
    "Make sure that the column called \"dob\" is in \"YYYY-MM-DD\" format.  " +
    "If not, you must convert it accordingly.  Failure to do so, will cause problems. " +
    "It is probably best if you set \"YYYY-MM-DD\" as your default date format.",
    "IMPORTANT: save the file with the type: CSV UTF-8 (Comma delimited) (*.csv) " +
    "The UTF-8 is critical or else all of accented characters will " +
    "become garbled in the player database.",
    "Save and !important! close the file. ",
    "Once you have done all of this, move to the next step."
  ];
  public step3:string[] = [
    "Please delete the .xlsx file you downloaded and .csv file you saved " +
    "(you have a lot of personal information on your computer and you do not " +
    "want it hanging around)."
  ];

  options: UploaderOptions;
  files: UploadFile[];
  file: UploadFile;
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  state: string;
  importStatus: JobStats;
  canUploadFile:boolean;
  canSelectFile: boolean;

  constructor(
      private jobStatusService: JobStatusService,
      private appState:AppStateService,
    ) {
    this.options = { concurrency: 1};
    this.files = [];
    this.file = null;
    // input events, we use this to emit data to ngx-uploader
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.appState.setActiveTool("Player Importer");
    // When initializing, check if there is already an upload in progress
    // If so, just join in to get status updates.
    this.jobStatusService.getPlayerImportJobStatus().subscribe(
      data => {
        this.importStatus = data;
        if (this.importStatus.status == JobState.IN_PROGRESS  ) {
          this.pollStatus();
        } else {
          this.setState("not started");
        }
      }
    );
  }

  // Handle events isssed by the file uploader - mostly the upload progress.
  onUploadOutput(output: UploadOutput): void {
    console.log(JSON.stringify(output));
    if (output.type === 'allAddedToQueue') {
      // could call startUpload to upload automatically here
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.file=(output.file);
      this.setState("selected");
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      this.file = output.file;
      this.setState("uploading");
    } else if (output.type === 'removed') {
      this.file = null;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    } else if (output.type === 'done') {
      this.file = output.file;
      if (this.file.responseStatus != 201) {
        this.setState("error");
        return;
      }
      // Once the file is uploaded, we can start polling the server to
      // see how the import is progressing.
      this.pollStatus();
    }
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'http://localhost:3002/Player/importVRPersonsCSV',
      method: 'POST',
      data: { }
    };
    this.setState("uploading");
    this.uploadInput.emit(event);
  }

  pollStatus():void {
    this.jobStatusService.getPlayerImportJobStatus().subscribe(
      data => {
        this.importStatus = data;
        if (this.importStatus.status == JobState.IN_PROGRESS  ) {
          this.setState("processing");
          setTimeout(() => this.pollStatus(),200);
        } else if (this.importStatus.status == JobState.DONE) {
          this.setState("done");
        }
      }
    )
  }

  setState(state:string) {
    this.state = state;
    if ("uploading" == this.state || "processing" == this.state) {
      this.canSelectFile = false;
    } else {
      this.canSelectFile = true;
    }
    if (this.state != "selected") {
      this.canUploadFile = false;
    } else {
      this.canUploadFile = true;
    }
  }
}

