/**
 * This allows users to browse results of Canadians playing in international
 * tournaments such as ITF, WTA and ATP.
 */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { ExternalTournamentService } from '../external-tournament.service';
import { ResultFilter } from './ResultFilter';
import { TC_DATE_FORMATS } from '../dateFormats';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-results-browser',
  templateUrl: './results-browser.component.html',
  styleUrls: ['./results-browser.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: TC_DATE_FORMATS},
  ]
})
export class ResultsBrowserComponent implements OnInit {
  // columns in the tournament table
  displayColumns = ['startDate', 'name', 'tournamentType',
    'eventType', 'fullName', 'id', 'vrid', 'drawSize', 'fp', 'jrPts', 'openPts', 'externalPts'];

  // The filtered set results
  results$: Observable<ExternalEventResultDTO[]>;
  filter: ResultFilter;
  search$ = new Subject<object>();

  results: MatTableDataSource<ExternalEventResultDTO>;
  loadingResults:boolean = false;
  resultCount:number = -1;

  endFilterPeriodFC: FormControl;
  startFilterPeriodFC: FormControl;

  sanctioningBodies = [
    {name: 'Any', value: null},
    {name: 'ITF', value: 'ITF'},
    {name: 'ATP', value: 'ATP'},
    {name: 'WTA', value: 'WTA'},
    {name: 'TE', value: 'TE'},
    {name: 'USTA', value: 'USTA'},
  ];

  sortOrders = [
    {name: 'Name/Date', value: 1},
    {name: 'Date/Tournament/Name', value: 2},
  ];

  selectedSanctioningBody;
  selectedSortOrder;

  constructor(
    private dataService: ExternalTournamentService
  )
  {
    this.results = new MatTableDataSource([]);
    this.endFilterPeriodFC = new FormControl(moment());
    this.startFilterPeriodFC = new FormControl(moment().subtract(1,'months'));
    this.selectedSanctioningBody = this.sanctioningBodies[0];
    this.selectedSortOrder = this.sortOrders[0];
    this.filter = new ResultFilter();
  };

  onEndDateChanged() {
    if (this.endFilterPeriodFC.value < this.startFilterPeriodFC.value) {
      this.startFilterPeriodFC.setValue(this.endFilterPeriodFC.value.subtract(1,'days'));
    }
  }

  onStartDateChanged() {
    if (this.endFilterPeriodFC.value < this.startFilterPeriodFC.value) {
      this.endFilterPeriodFC.setValue(this.startFilterPeriodFC.value.add(1,'days'));
    }
  }

  // someone wants to focus on a single player
  onVRIDSelected(vrid:string) {
    this.filter.VRID = vrid;
    this.filter.playerId = null;
    this.filter.lastName = null;
    this.filter.tournamentName = null;
    this.search();
  }
  onPlayerIDSelected(playerId:string) {
    this.filter.VRID = null;
    this.filter.playerId = playerId;
    this.filter.lastName = null;
    this.filter.tournamentName = null;
    this.search();
  }
  onTournamentNameSelected(tournamentName:string) {
    this.filter.VRID = null;
    this.filter.playerId = null;
    this.filter.lastName = null;
    this.filter.tournamentName = tournamentName;
    this.search();
  }

  ngOnInit() {
    this.results$ = this.search$
      .switchMap((filter: ResultFilter) => this.dataService.getFilteredResults(filter))
      .catch(error => {
        console.log(error);
        return Observable.of<any[]>([]);
      });

    this.results$.subscribe(data => {
      this.loadingResults = false;
      this.results.data = data;
      this.resultCount = this.results.data.length;
    });
  }

  search() {
    this.loadingResults = true;
    this.filter.end = this.endFilterPeriodFC.value.format("YYYY-MM-DD");
    this.filter.start = this.startFilterPeriodFC.value.format("YYYY-MM-DD");
    this.filter.sanctioningBody = this.selectedSanctioningBody.value;
    this.filter.sortOrder = this.selectedSortOrder.value;
    this.search$.next(this.filter)
  }

  export() {
    const exportHeaders = ['p1memberId', 'playername', 'tournamentname', 'eventname',
      'finalposition', 'result', 'tournamentyear', 'tournamentweek', 'externalpoints', 'points'];
    const juniorData = [];
    juniorData.push(exportHeaders);
    const openData = [];
    openData.push(exportHeaders);


    for (const result of this.results.data) {
      const tournamentDate = moment(result.endDate);
      const jrRow = [];
      if (result.isJunior && !isNaN(parseInt(result.tcJuniorPoints))) {
        jrRow.push(result.internalId);
        jrRow.push(result.playerName);
        jrRow.push(result.tournamentName);
        jrRow.push(result.eventDescription);
        jrRow.push(result.finishPosition);
        jrRow.push(Math.round(Math.log2(result.finishPosition)));
        jrRow.push(tournamentDate.year());
        jrRow.push(tournamentDate.isoWeek());
        jrRow.push(result.externalRankingPoints);
        jrRow.push(parseInt(result.tcJuniorPoints));
        juniorData.push(jrRow);
      }
      const openRow = [];
      if (!isNaN(parseInt(result.tcOpenPoints))) {
        openRow.push(result.internalId);
        openRow.push(result.playerName);
        openRow.push(result.tournamentName);
        openRow.push(result.eventDescription);
        openRow.push(result.finishPosition);
        openRow.push(Math.round(Math.log2(result.finishPosition)));
        openRow.push(tournamentDate.year());
        openRow.push(tournamentDate.isoWeek());
        openRow.push(result.externalRankingPoints);
        openRow.push(parseInt(result.tcOpenPoints));
        openData.push(openRow);
      }
    }
    const now = moment().format('YYYY-MM-DD-HH-mm-ss');

    var jws = XLSX.utils.aoa_to_sheet(juniorData);
    jws['!cols'] = [
      {wch: 12},
      {wch: 25},
      {wch: 35},
      {wch: 11},
      {wch: 11},
      {wch: 11},
      {wch: 14},
      {wch: 11},
      {wch: 11},
      {wch: 11},
    ];
    const jwb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(jwb, jws, 'results');
    XLSX.writeFile(jwb, `JuniorResults-${now}.xlsx`);

    var ows = XLSX.utils.aoa_to_sheet(openData);
    ows['!cols'] = [
      {wch: 12},
      {wch: 25},
      {wch: 35},
      {wch: 11},
      {wch: 11},
      {wch: 11},
      {wch: 14},
      {wch: 11},
      {wch: 11},
      {wch: 11},
    ];
    const owb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(owb, ows, 'results');
    XLSX.writeFile(owb, `OpenResults-${now}.xlsx`);
  }
}

export class ExternalEventResultDTO {
  finishPosition: number;
  externalRankingPoints: number;
  manualPointAllocation: number;
  tcJuniorPoints: string;
  tcOpenPoints: string;
  tournamentName: string;
  tournamentType: string;
  endDate: string;
  sanctioningBody: string;
  eventDescription: string;
  playerName: string;
  externalId:string;
  internalId:string;
  drawSize: number;
  isJunior: boolean;
  yob: number;
}
