import {Component, OnInit} from '@angular/core';
import {VRLicenseService} from "../vrlicense.service";
import {AppStateService} from "../../app-state.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-license-reporter',
  templateUrl: './license-reporter.component.html',
  styleUrls: ['./license-reporter.component.css'],
})
export class VRLicenseReporterComponent implements OnInit {
  licenseReportURL: string;
  constructor(    private licenseService: VRLicenseService,
                  private appState: AppStateService,
  ) {
  }
  ngOnInit() {
    this.appState.setActiveTool(" License Usage Reporter");
    this.licenseReportURL = environment.serverPrefix + "/license/usageReport";
  }
}

