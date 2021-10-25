import { Component, OnInit } from '@angular/core';
import {AppStateService} from "../app-state.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {STATSTOOL} from '../../assets/stats-tools';

@Component({
  selector: 'app-utr-report',
  templateUrl: './utr-report.component.html',
  styleUrls: ['./utr-report.component.scss']
})
export class UtrReportComponent implements OnInit {
  buildingReport = false;
  result: any;
  showResult: boolean = false;
  duration: number;

  constructor( private appState: AppStateService,
               private http: HttpClient) { }

  ngOnInit() {
    this.appState.setActiveTool(STATSTOOL.UTR_REPORTER);
  }

  dismissResult() {
    this.showResult = false;
  }

  buildReport() {
    this.buildingReport = true;
    let reportURL = environment.serverPrefix + '/Exports/UTRReport';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    this.http.get<string>(reportURL, httpOptions)
      .subscribe((res: any) => {
        this.buildingReport = false;
        this.showResult = true;
        this.result = res;
        this.duration = (new Date(res.endTime).getTime() - new Date(res.startTime).getTime())/1000;
      });
  }

  // TODO more robust error handling :-)
}
