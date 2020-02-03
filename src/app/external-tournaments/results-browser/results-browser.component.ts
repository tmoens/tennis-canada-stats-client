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
  displayColumns = ['endDate', 'name', 'tournamentType', 'fullName', 'vrid',
     'drawSize', 'fp', 'pc', 'tcPts', 'externalPts', 'epOverride'];

  // The filtered set results
  results$: Observable<ExternalEventResultDTO[]>;
  filter: ResultFilter;
  search$ = new Subject<object>();

  results: MatTableDataSource<ExternalEventResultDTO>;
  loadingResults:boolean = false;
  resultCount:number = -1;

  endFilterPeriodFC: FormControl;
  startFilterPeriodFC: FormControl;

  tournamentTypes = [
    {name: 'Any', value: null},
    {name: 'WTA', value: 'WTA'},
    {name: 'ATP', value: 'ATP'},
    {name: 'ITF Pro Women', value: 'ITF Pro Women'},
    {name: 'ITF Pro Men', value: 'ITF Pro Men'},
    {name: 'ITF TT Women (2019)', value: 'ITF TT Women'},
    {name: 'ITF TT Men (2019)', value: 'ITF TT Men'},
    {name: 'ITF Junior', value: 'ITF Junior'},
  ];
  selectedTournamentType;

  constructor(
    private dataService: ExternalTournamentService
  )
  {
    this.results = new MatTableDataSource([]);
    this.endFilterPeriodFC = new FormControl(moment());
    this.startFilterPeriodFC = new FormControl(moment().subtract(14,'days'));
    this.selectedTournamentType = this.tournamentTypes[0];
    this.filter = new ResultFilter();
  };

  onEndDateChanged() {
    if (this.endFilterPeriodFC.value < this.startFilterPeriodFC.value) {
      this.startFilterPeriodFC.setValue(this.endFilterPeriodFC.value.subtract(1,'days'));
    }
    this.search();
  }

  onStartDateChanged() {
    if (this.endFilterPeriodFC.value < this.startFilterPeriodFC.value) {
      this.endFilterPeriodFC.setValue(this.startFilterPeriodFC.value.add(1,'days'));
    }
    this.search();
  }

  // someone wants to focus on a single player
  onVRIDSelected(vrid:string) {
    this.filter.VRID = vrid;
    this.filter.playerId = null;
    this.filter.lastName = null;
    this.filter.tournamentName = null;
    this.search();
  }
  onPlayerNameSelected(playerId:string) {
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
    this.search();
  }

  onPointOverride(er: ExternalEventResultDTO) {
    this.dataService.overrideExternalPoints(er).subscribe(
      data => {
        console.log('Updated DTO: ' + JSON.stringify(data));
      }
    );
  }
  search() {
    this.loadingResults = true;
    this.filter.end = this.endFilterPeriodFC.value.format("YYYY-MM-DD");
    this.filter.start = this.startFilterPeriodFC.value.format("YYYY-MM-DD");
    switch (this.selectedTournamentType.value) {
      case 'ATP':
        this.filter.sanctioningBody = 'ATP';
        this.filter.category = null;
        this.filter.gender = null;
        break;
      case 'ITF Pro Men':
        this.filter.sanctioningBody = 'ITF';
        this.filter.category = 'Pro';
        this.filter.gender = 'M';
        break;
      case 'WTA':
        this.filter.sanctioningBody = 'WTA';
        this.filter.category = null;
        this.filter.gender = null;
        break;
      case 'ITF Pro Women':
        this.filter.sanctioningBody = 'ITF';
        this.filter.category = 'Pro';
        this.filter.gender = 'F';
        break;
      case 'ITF TT Women':
        this.filter.sanctioningBody = 'ITF';
        this.filter.category = 'TT';
        this.filter.gender = 'F';
        break;
      case 'ITF TT Men':
        this.filter.sanctioningBody = 'ITF';
        this.filter.category = 'TT';
        this.filter.gender = 'M';
        break;
      case 'ITF Junior':
        this.filter.sanctioningBody = 'ITF';
        this.filter.category = 'Junior';
        this.filter.gender = null;
        break;
      default:
        this.filter.sanctioningBody = null;
        this.filter.category = null;
        this.filter.gender = null;

    }
    this.search$.next(this.filter)
  }

  export() {
    const exportHeaders = ['p1memberId', 'playername', 'tournamentname', 'eventname',
      'finalposition1', 'DrawSize', 'result', 'tournamentyear', 'tournamentweek', 'Type', 'ExternalPoints',
      'points', 'FRL', 'ManualExtPts'];
    const juniorData = [];
    juniorData.push(exportHeaders);
    const openData = [];
    openData.push(exportHeaders);


    // Note to future self.  The "eventDescription" field requested by VR is actually
    // theRankingCategoryThisResultBelongsIn. Hard learned lesson #893221a.

    for (const result of this.results.data) {
      if (isNaN(parseInt(result.tcPoints))) continue;
      const tournamentDate = moment(result.endDate);
      const row = [];
      row.push(result.internalId);
      row.push(result.playerName);
      row.push(result.tournamentName);
      row.push(result.pointsCategory);
      row.push(result.finishPosition);
      row.push(result.drawSize);
      row.push(Math.round(Math.log2(result.finishPosition)));
      row.push(tournamentDate.year());
      row.push(tournamentDate.isoWeek());
      row.push(result.tournamentType);
      row.push(result.externalRankingPoints);
      row.push(parseInt(result.tcPoints));
      row.push((result.drawSize <= result.finishPosition) ? 'FRL' : '');
      row.push((result.manualPointAllocation) ? result.manualPointAllocation: '');
      if (result.eventType === 'Open') {
        openData.push(row);
      } else {
        juniorData.push(row);
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
      {wch: 11},
      {wch: 14},
      {wch: 11},
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
      {wch: 11},
      {wch: 14},
      {wch: 11},
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
  eventId: string;
  finishPosition: number;
  externalRankingPoints: number;
  manualPointAllocation: number;
  tcPoints: string;
  tournamentName: string;
  sanctioningBody: string;
  endDate: string;
  tournamentType: string;
  eventType: string;
  eventGender: string;
  eventDiscipline: string;
  pointsCategory: string;
  shortPointsCategory: string;
  playerName: string;
  drawSize: number;
  yob: number;
  externalId: string;
  internalId: number;
}
