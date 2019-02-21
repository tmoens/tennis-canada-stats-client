import { Component, OnInit } from '@angular/core';
import {AppStateService} from "../app-state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  statsApps: StatsApp[] = [];
  constructor(
    private router: Router,
    public appState:AppStateService,
    ) { }

  ngOnInit() {
    this.appState.setActiveTool("Home");
    this.statsApps.push(new StatsApp(
      'License Manager',
      '/vr_license_manager',
      'Add a PTA for any licenses that do not have one'
    ));
    this.statsApps.push(new StatsApp(
      'License Reporter Manager',
      '/vr_license_reporter',
      'Learn about VR Tournament Planner license usage'
    ));
    this.statsApps.push(new StatsApp(
      'Player Importer',
      '/player_import',
      'Load the most recent player data into the system.',
      'This should be done monthly'
    ));
    this.statsApps.push(new StatsApp(
      'Player Merge Importer',
      '/player_merge_import',
      'Tell the system about player Id merges in VR.',
    ));
    this.statsApps.push(new StatsApp(
      'Tournament Strength Reporter',
      '/tournament_strength',
      'Rate a set of tournaments based on their strength.',
    ));
    this.statsApps.push(new StatsApp(
      'UTR Reporter',
      '/utr_report',
      'Send recent match data to UTR.',
    ));
    this.statsApps.push(new StatsApp(
      'External Data Admin',
      '/external_data_admin',
      'Manage competitive data from non Tennis Canada tournaments.',
    ))
    this.statsApps.push(new StatsApp(
      'ITF Data Exporter',
      '/itf_exports',
      'Create excel files to export to the ITF',
    ))
  }

  navigateToApp(app: StatsApp) {
    this.router.navigateByUrl(app.route)
  }
}


export class StatsApp {
  iconName: string;

  constructor(
    public name: string,
    public route: string,
    public description: string,
    public detail: string = ''
  ) {}
}
