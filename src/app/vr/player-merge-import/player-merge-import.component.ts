import {Component, OnInit} from '@angular/core';
import {JobState, JobStats} from "../../job-status.service";
import * as XLSX from "xlsx";
import {VRPlayerService} from "../player.service";

@Component({
  selector: 'app-player-merge-import',
  templateUrl: './player-merge-import.component.html',
  styleUrls: ['./player-merge-import.component.css']
})
export class PlayerMergeImportComponent implements OnInit {
  fileToUpload:File = null;
  public notes:string[] = [
    "When Player IDs get merged in the VR system, the merge is not sent " +
    "out via the VR API.  Instead we have to load the merge information here.",
    "We do two things a) we renumber historical data and b) we set it up " +
    "so that if we encounter a merged Id in the future, we renumber it."
  ];
  public step1:string[] = [
    "Create a simple .csv file (using Excel and Save As file type csv.",
    'Columns must contain blah blah blah',
    "Warning, these changes are permanent and cannot be undone - so dn't screw up."
  ];

  state: string;
  canProcessFile: boolean;
  canSelectFile: boolean;
  canShowResults: boolean;
  mergeStatus: JobStats;
  results:Array<any> = [];
  data;
  error:string;
  fileName:string;


  constructor(private playerService:VRPlayerService) {
  }

  ngOnInit() {
    this.setState("waiting");
    this.mergeStatus =  {
      startTime: new Date(),
      status: JobState.NOT_STARTED,
    }
  }

  processFile() {
    let mergeRecord: PlayerMergeRecord;
    this.mergeStatus =  {
      startTime: new Date(),
      status: JobState.NOT_STARTED,
    }
    this.results = [];
    this.mergeStatus.toDo = this.data.length;
    this.mergeStatus.counters = {done:0};
    this.mergeStatus.percentComplete = 0;
    this.setState("processing");
    for (let i = 0; i < this.data.length; i++) {
      try {
        mergeRecord = <PlayerMergeRecord> this.data[i];
      } catch (e) {
        this.results.push("Bad record in data file: " + JSON.stringify(this.data[i]));
      }
      this.playerService.mergePlayers(mergeRecord)
        .subscribe(data=> {this.results.push(data);
          this.mergeStatus.counters.done++;
          this.mergeStatus.percentComplete = 100 * this.mergeStatus.counters.done / this.mergeStatus.toDo;
        })
    }
    this.setState("done");
  }


  onFileChange(evt: any) {
    this.error = null;
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* load the data - the first line is expected to be headers */
      this.data = XLSX.utils.sheet_to_json(ws, {});
      // console.log(JSON.stringify(this.data));
      if (this.validateMergeData()) {
        this.setState("selected");
      } else {
        this.setState("waiting");
      };
    };
    console.log(target.files[0]);
    // give a half-assed check to make sure the file is an excel file.
    if (!target.files[0].name.endsWith(".xlsx")) {
      this.error = "Unable to read file.  Expected type is .xlsx";
      this.setState("waiting");
    } else {
      reader.readAsBinaryString(target.files[0]);
      this.fileName = target.files[0].name;
    }
  }

  // cursory check of minimal requirements for a data file
  validateMergeData():boolean {
    if (this.data.length <= 0) {
      this.error = "Empty data file";
    }
    let check = this.data[0];
    if (!check.hasOwnProperty('fromPlayerId')){
      this.error = 'Data must have a "fromPlayerId" column.';
      return false
    };
    if (!check.hasOwnProperty('toPlayerId')){
      this.error = 'Data must have a "toPlayerId" column.';
      return false
    };
    return true;
  }


  setState(state:string) {
    this.state = state;
    switch (this.state) {
      case "waiting":
        this.canSelectFile = true;
        this.canProcessFile = false;
        this.canShowResults = false;
        break;
      case "selected":
        this.canSelectFile = true;
        this.canProcessFile = true;
        this.canShowResults = false;
        break;
      case "processing":
        this.canSelectFile = false;
        this.canProcessFile = true;
        this.canShowResults = true;
        break;
      case "done":
        this.canSelectFile = true;
        this.canProcessFile = false;
        this.canShowResults = true;
        break;
      default:
        this.canSelectFile = false;
        this.canProcessFile = false;
        this.canShowResults = false;
    }
  }
}

export interface PlayerMergeRecord {
  fromPlayerId: number,
  toPlayerId:number,
  fromLastName?: string,
  toLastName?: string,
  fromFirstName?: string,
  toFistName?: string,
  date?:string,
}
