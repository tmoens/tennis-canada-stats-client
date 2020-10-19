/**
 * When the ITF Data loader loads WTA, ATP and ITF tournaments from the
 * ITF API, sometimes there is insufficient information to completely
 * categorize the tournament for the purpose of awarding Tennis Canada
 * ranking points for results in the tournament.
 *
 * This component allows the user to complete the categorization.
 *
 * In fact, the user simply needs to choose the sub-category for
 * things like ATP Futures or WTA Challenge Series or ITF Grade A
 * tournaments.  That is all.
 */
import { Component, OnInit  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { ExternalTournamentService } from '../external-tournament.service';
import { TournamentFilter } from './tournament-filter';
import { TC_DATE_FORMATS } from '../dateFormats';
import {FormControl} from '@angular/forms';
import {ExternalTournament} from '../external-tournament';

@Component({
  selector: 'app-tournament-rater',
  templateUrl: './tournament-rater.component.html',
  styleUrls: ['./tournament-rater.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: TC_DATE_FORMATS},
  ]
})

export class TournamentRaterComponent implements OnInit {
  // columns in the tournament table
  displayColumns = ['name', 'country', 'sanctioningBody', 'category', 'endDate', 'tournamentType'];

  // The list of tournaments that need classification by the user
  tournaments: ExternalTournament[];

  // For filtering the list of tournaments
  filter: TournamentFilter;

  // For presenting the tournaments in a material table
  ut: MatTableDataSource<ExternalTournament>;

  // Progress indicators
  loadingTournaments:boolean;

  endFilterPeriodFC: FormControl;
  startFilterPeriodFC: FormControl;

  constructor(
    private tournamentService: ExternalTournamentService,
  ) {
    this.tournaments = [];
    this.ut = new MatTableDataSource(this.tournaments);
    this.filter = new TournamentFilter();
    this.endFilterPeriodFC = new FormControl(moment());
    this.startFilterPeriodFC = new FormControl(moment().subtract(1,'months'));
    this.filter.sanctioningBody = 'ITF';
    this.filter.category = 'Open';
    this.filter.gender = 'F';
  }

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

  ngOnInit() {
    this.search();
  }

  search() {
    this.filter.endPeriod = this.endFilterPeriodFC.value.format("YYYY-MM-DD");
    this.filter.startPeriod = this.startFilterPeriodFC.value.format("YYYY-MM-DD");
    this.loadTournaments();
  }

  loadTournaments() {
    this.loadingTournaments = true;
    this.tournamentService.getFilteredTournaments(this.filter)
        .subscribe(data => this.tournamentsArrived(data));
  }

  tournamentsArrived(data) {
    this.tournaments = data;
    this.ut = new MatTableDataSource(this.tournaments);
    this.loadingTournaments = false;
  }

  onTournamentTypeChange(tournament: ExternalTournament) {
    this.tournamentService.categorizeTournament(tournament)
    .subscribe()
  }
}
