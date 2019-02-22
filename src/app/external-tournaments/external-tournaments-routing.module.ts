import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExternalPlayerManagerComponent} from "./external-player-manager/external-player-manager.component";
import {ExternalTournamentService} from "./external-tournament.service";
import {TournamentRaterComponent} from "./tournament-rater/tournament-rater.component";
import {ResultsBrowserComponent} from "./results-browser/results-browser.component";
import {ExternalTournamentsComponent} from "./external-tournaments.component";
import {OktaAuthGuard} from '@okta/okta-angular';

const routes: Routes = [
  { path: 'external_data_admin',
    component: ExternalTournamentsComponent,
    children: [
      {
        path: 'idmapping',
        component: ExternalPlayerManagerComponent,
        canActivate: [ OktaAuthGuard ],
      },
      {
        path: 'tournamentRater',
        component: TournamentRaterComponent,
        canActivate: [ OktaAuthGuard ],
      },
      {
        path: 'resultsBrowser',
        component: ResultsBrowserComponent,
        canActivate: [ OktaAuthGuard ],
      },
      {
        path: '',
        component: ExternalPlayerManagerComponent,
        canActivate: [ OktaAuthGuard ],
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    ExternalTournamentService,
  ],

})
export class ExternalTournamentsRoutingModule { }
