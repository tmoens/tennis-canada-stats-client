import { Component, OnInit } from '@angular/core';
import {AppStateService} from '../app-state.service';
import {STATSTOOL} from '../../assets/stats-tools';

@Component({
  selector: 'app-external-tournaments',
  templateUrl: './external-tournaments.component.html',
  styleUrls: ['./external-tournaments.component.scss']
})
export class ExternalTournamentsComponent implements OnInit {
  navLinks: any[];
  activeLink: any;
  constructor(
    private appState: AppStateService,
  ) {
    // TODO Add back the manual tournament entry app
    this.navLinks = [
      {
        label: 'Manage External Player Identities',
        link: './idmapping',
        index: 0
      }, {
        label: 'Results Browser and Exporter',
        link: './resultsBrowser',
        index: 2
      },
    ];
    this.activeLink = this.navLinks[0];
  }

  ngOnInit() {
    this.appState.setActiveTool(STATSTOOL.EXTERNAL_DATA_ADMIN);
  }

}
