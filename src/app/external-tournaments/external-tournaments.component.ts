import { Component, OnInit } from '@angular/core';
import {AppStateService} from "../app-state.service";
import {RatingService} from "./rating-service.service";
import {Router} from "@angular/router";

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
    private ratingService: RatingService,
  ) {
    // TODO Add back the manual tournament entry app
    this.navLinks = [
      {
        label: 'Manage External Player Identities',
        link: './idmapping',
        index: 0
      }, {
        label: 'ResultsBrowser',
        link: './resultsBrowser',
        index: 1
      }, {
        label: 'Rate Tournaments',
        link: './tournamentRater',
        index: 2
      },
    ];
    this.activeLink = this.navLinks[0];
    // The rating service is used to rate non tennis canada events, it
    // loads data here and never needs to talk to the server again.
    this.ratingService.loadRatings()
  }

  ngOnInit() {
    this.appState.setActiveTool("External Competitive Results Admin");
  }

}
