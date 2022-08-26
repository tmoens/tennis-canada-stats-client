import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {AppStateService} from '../app-state.service';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { TC_DATE_FORMATS } from '../dateFormats';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import * as XLSX from 'xlsx';
import {WorkBook, WorkSheet, utils} from 'xlsx';
import {STATSTOOL} from '../../assets/stats-tools';

@Component({
  selector: 'app-tournament-strength',
  templateUrl: './play-report.component.html',
  styleUrls: ['./play-report.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: TC_DATE_FORMATS},
  ],
})
export class PlayReportComponent implements OnInit {
  buildingReport = false;
  result = 'nadda';
  today: Date;
  beginningOfTime: Date;
  fromDate: Date;
  toDate: Date;

  dateRange = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl()
  });

  constructor(private appState: AppStateService, private http: HttpClient) {
  }

  ngOnInit() {
    this.appState.setActiveTool(STATSTOOL.PLAY_REPORTER);
    this.today = new Date();
    this.beginningOfTime = new Date('2014-01-01');
    this.toDate = new Date();
    this.fromDate = new Date(this.toDate.getTime() - 365 * 24 * 60 * 60 * 1000);
    this.dateRange.controls['start'].setValue(this.fromDate);
    this.dateRange.controls['end'].setValue(this.toDate);
  }

  // Construct the URL which is used to build the report.
  buildReportURL(): string {
    const searchString = [];
    return environment.serverPrefix + '/tournament/buildPlayReport' +
      '?to=' + this.dateRange.controls['end'].value.toISOString().substr(0, 10) +
      '&from=' + this.dateRange.controls['start'].value.toISOString().substr(0, 10);
  }

  getReport() {
    this.buildingReport = true;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    this.http.get<string>(this.buildReportURL(), httpOptions)
      .subscribe((res: any) => {
        this.buildingReport = false;
        this.generatePlayReportWorkbook(res);
      });
  }

  generatePlayReportWorkbook(data: any[]) {
    const wb: WorkBook = utils.book_new();
    const ws: WorkSheet = utils.json_to_sheet(data);
    ws['!cols'] = [
      {wch: 35}, {wch: 9}, {wch: 11}, {wch: 11},
      {wch: 15}, {wch: 15}, {wch: 4}, {wch: 15},
      {wch: 8}, {wch: 8}, {wch: 8}, {wch: 8},
      {wch: 8}, {wch: 8}, {wch: 15}, {wch: 9},
      {wch: 12}, {wch: 12}, {wch: 4}, {wch: 11},
      {wch: 4},
    ];
    utils.book_append_sheet(wb, ws, 'Players');
    const now = new Date().toISOString();
    XLSX.writeFile(wb, 'PlayData-' + now + '.xlsx');
  }
}



