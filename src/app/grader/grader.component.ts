import { Component, OnInit } from '@angular/core';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {TC_DATE_FORMATS} from '../external-tournaments/dateFormats';
import {Observable, of, Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, UntypedFormControl} from '@angular/forms';
import * as moment from 'moment/moment';
import {catchError, debounceTime, switchMap} from 'rxjs/operators';
import {GradingFilter} from './grading-filter';
import {GradingDTO} from './grading-dto';
import {GraderService} from './grader-service';

@Component({
  selector: 'app-grader',
  templateUrl: './grader.component.html',
  styleUrls: ['./grader.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: TC_DATE_FORMATS},
  ]
})
export class GraderComponent implements OnInit {
  vrBaseURL = 'https://tc.tournamentsoftware.com/tournament/';
  // columns in the tournament table
  displayColumns = [
    'name',
    'endDate',
    'type',
    'vrGrade',
    'approvedGrade',
  ];

  // The filtered set of gradings
  results$: Observable<GradingDTO[]>;
  filter: GradingFilter;
  search$ = new Subject<object>();

  results: MatTableDataSource<GradingDTO>;
  loadingResults = false;
  resultCount = -1;

  includeLeaguesFC = new FormControl({value: true, disabled: true});
  includeTournamentsFC = new FormControl(false);
  includeGoodApprovalsFC = new FormControl(false);

  gradingsSinceFC: UntypedFormControl;

  constructor(
    private dataService: GraderService,
  ) {
    this.results = new MatTableDataSource([]);
    this.gradingsSinceFC = new UntypedFormControl(moment().subtract(24, 'days'));
    this.filter = new GradingFilter();
  }

  ngOnInit() {
    this.results$ = this.search$
      .pipe(
        switchMap((filter: GradingFilter) => this.dataService.getCurrentGradings(filter)),
        catchError(error => {
          console.log(error);
          return of<any[]>([]);
        })
      );

    this.results$.subscribe(data => {
      this.loadingResults = false;
      this.results.data = data;
      this.resultCount = this.results.data.length;
    });

    this.includeTournamentsFC.valueChanges.pipe(
      debounceTime(300)).subscribe((value: boolean ) => {
      this.filter.showTournaments = value;
      this.search();
    });

    this.includeGoodApprovalsFC.valueChanges.pipe(
      debounceTime(300)).subscribe((value: boolean ) => {
      this.filter.showAll = value;
      this.search();
    });

    this.search();
  }

  onDateChanged() {
    this.search();
  }

  setApprovedGrade(t: GradingDTO) {
    this.dataService.setGrade(t.tournamentCode, t.approvedGrade).subscribe();
  }

  refresh() {
    this.search();
  }

  search() {
    this.loadingResults = true;
    this.filter.since = this.gradingsSinceFC.value.format('YYYY-MM-DD');
    this.search$.next(this.filter);
  }
}
