import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {OktaAuthGuard, OktaCallbackComponent} from "@okta/okta-angular";
import {LoginComponent} from "./auth/login.component";
import {VRLicenseManagerComponent} from "./vr/vrlicense-manager/vrlicense-manager.component";
import {VRLicenseReporterComponent} from "./vr/license-reporter/license-reporter.component";
import {PlayerImportComponent} from "./vr/player-import/player-import.component";
import {PlayerMergeImportComponent} from "./vr/player-merge-import/player-merge-import.component";
import {TournamentStrengthComponent} from "./tournament-strength/tournament-strength.component";
import {UtrReportComponent} from "./utr-report/utr-report.component";
import {HomeComponent} from "./home/home.component";
import {environment} from "../environments/environment";
import {ExternalTournamentsComponent} from "./external-tournaments/external-tournaments.component";

const routes: Routes = [
  {
    path: 'implicit/callback',
    component: OktaCallbackComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'vr_license_manager',
    component: VRLicenseManagerComponent,
    canActivate: [ OktaAuthGuard ],
  },
  { path: 'vr_license_reporter',
    component: VRLicenseReporterComponent,
    canActivate: [ OktaAuthGuard ],
  },
  { path: 'player_import',
    component: PlayerImportComponent,
    canActivate: [ OktaAuthGuard ],
  },
  { path: 'player_merge_import',
    component: PlayerMergeImportComponent,
    canActivate: [ OktaAuthGuard ],
  },
  { path: 'tournament_strength',
    component: TournamentStrengthComponent,
    canActivate: [ OktaAuthGuard ],
  },
  { path: 'utr_report',
    component: UtrReportComponent,
    canActivate: [ OktaAuthGuard ],
  },
  {
    path: 'external_data_admin',
    component: ExternalTournamentsComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }

