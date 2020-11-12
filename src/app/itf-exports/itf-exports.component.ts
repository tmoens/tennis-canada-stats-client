import { Component, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import {TC_DATE_FORMATS} from '../external-tournaments/dateFormats';
import {FormControl} from '@angular/forms';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import {AppStateService} from '../app-state.service';
import {VRPlayerService} from '../vr/player.service';

@Component({
  selector: 'app-itf-exports',
  templateUrl: './itf-exports.component.html',
  styleUrls: ['./itf-exports.component.scss'],
  providers: [{provide: MAT_DATE_FORMATS, useValue: TC_DATE_FORMATS}],
})
export class ItfExportsComponent implements OnInit {
  loadingPlayers = false;
  loadingMatchData = false;

  updatedSinceFC: FormControl;

  constructor(
    private dataService: VRPlayerService,
    private appState: AppStateService,
  ) {
    this.updatedSinceFC = new FormControl('2016-01-01T00:00:00');
  }

  ngOnInit() {
    this.appState.setActiveTool('ITF Data Export Tool');
  }

  async exportPlayerData() {
    this.loadingPlayers = true;
    this.dataService.getPlayerDataForITF().subscribe(
      (data: ITFPlayerDTO[]) => {
        const now = moment().format('YYYY-MM-DD-HH-mm-ss');
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'players');
        XLSX.writeFile(wb, `TCPlayers-${now}.xlsx`);
        this.loadingPlayers = false;
      }
    );
  }

  async exportMatchData() {
    this.loadingMatchData = true;
    this.dataService.getITFMatchData(this.updatedSinceFC.value.toISOString().substr(0, 10)).subscribe(
      (data: ITFMatchDTO[]) => {
        const now = moment().format('YYYY-MM-DD-HH-mm-ss');
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'matches');
        XLSX.writeFile(wb, `TCMatchData-${now}.xlsx`);
        this.loadingPlayers = false;
      }
    );
  }
}


export class ITFPlayerDTO {
  IPIN: string = null;
  NationalPlayerID: string = null;
  Sex: string = null;
  BirthDate: string = null;
  GivenName: string = null;
  FamilyName: string = null;
  StandardGivenName: string = null;
  StandardFamilyName: string = null;
  NationalityCode = 'CAN';
  EmailAddress: string = null;
  AddressCity: string = null;
  AddressState: string = null;
  AddressPostalCode: string = null;


  tcPlayerId: number;
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  gender: string;
}

export class ITFMatchDTO {
  MatchUpID: string = null;
  Side1Player1ID: string = null;
  Side1Player2ID: string = null;
  Side2Player1ID: string = null;
  Side2Player2ID: string = null;
  WinningSide: number = null;
  Score: string = null;
  MatchUpStatus: string = null;
  MatchUpType: string = null;
  TournamentName: string = null;
  TournamentID: string = null;
  MatchUpStartDate: string = null;
  TournamentStartDate: string = null;
  TournamentEndDate: string = null;
  AgeCategoryCode: string = null;
  TournamentLevel: string = null;
  Gender: string = null;
  MatchFormat: string = null;
}
