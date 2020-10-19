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
  loadingPlayers:boolean = false;
  loadingMatchData: boolean = false;

  updatedSinceFC: FormControl;

  constructor(
    private dataService: VRPlayerService,
    private appState: AppStateService,
  )
  {
    this.updatedSinceFC = new FormControl(moment().subtract(14,'days'));
  };

  ngOnInit() {
    this.appState.setActiveTool("ITF Data Export Tool");
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
    this.dataService.getITFMatchData(this.updatedSinceFC.value.format("YYYY-MM-DD")).subscribe(
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
  TennisID: string = null;
  IPIN: string = null;
  PlayerID: string = null;
  Gender: string = null;
  BirthDate: string = null;
  PassportGivenName: string = null;
  PassportFamilyName: string = null;
  PreferredGivenName: string = null;
  PreferredFamilyName: string = null;
  Nationality: string = 'CA';
  NationalRating: string = null;
  PostalCode: string = null;
  Email: string = null;
  Source: string = null;

  tcPlayerId: number;
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  gender: string;
}

export class ITFMatchDTO {
  MatchID: string = null;
  Side1Player1ID: string = null;
  Side1Player2ID: string = null;
  Side2Player1ID: string = null;
  Side2Player2ID: string = null;
  MatchWinner: number = null;
  SurfaceType: string = 'H';
  Score: string = null;
  MatchStatus: string = null;
  ScoreSet1Side1: number = null;
  ScoreSet1Side2: number = null;
  ScoreSet1WinningTieBreak: number = null;
  ScoreSet1LosingTieBreak: number = null;
  ScoreSet2Side1: number = null;
  ScoreSet2Side2: number = null;
  ScoreSet2WinningTieBreak: number = null;
  ScoreSet2LosingTieBreak: number = null;
  ScoreSet3Side1: number = null;
  ScoreSet3Side2: number = null;
  ScoreSet3WinningTieBreak: number = null;
  ScoreSet3LosingTieBreak: number = null;
  ScoreSet4Side1: number = null;
  ScoreSet4Side2: number = null;
  ScoreSet4WinningTieBreak: number = null;
  ScoreSet4LosingTieBreak: number = null;
  ScoreSet5Side1: number = null;
  ScoreSet5Side2: number = null;
  ScoreSet5WinningTieBreak: number = null;
  ScoreSet5LosingTieBreak: number = null;
  MatchType: string = null;
  TournamentID: string = null;
  TournamentName: string = null;
  MatchStartDate: string = null;
  MatchEndDate: string = null;
  TournamentStartDate: string = null;
  TournamentEndDate: string = null;
  AgeCategoryCode: string = null;
  IndoorFlag: boolean = false;
  Grade: string = null;
  MatchFormat: string = null;
}
