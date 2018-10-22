import { Component, OnInit } from '@angular/core';
import {AppStateService} from "../app-state.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-utr-report',
  templateUrl: './utr-report.component.html',
  styleUrls: ['./utr-report.component.css']
})
export class UtrReportComponent implements OnInit {
  buildingReport = false;
  test: string = '';

  constructor( private appState: AppStateService,
               private http: HttpClient) { }

  ngOnInit() {
    this.appState.setActiveTool('UTR Report Tool');
  }

  buildReport() {
    this.buildingReport = true;
    let reportURL = environment.serverPrefix + '/utr/buildUTRReport';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    this.http.get<string>(reportURL, httpOptions)
      .subscribe((res: any) => {
        this.buildingReport = false;
        this.test = JSON.stringify(res);
      });
  }
}
