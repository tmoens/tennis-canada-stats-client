import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular';
import {LoginComponent} from './auth/login.component';
import {VRLicenseManagerComponent} from './vr/vrlicense-manager/vrlicense-manager.component';
import {VRLicenseReporterComponent} from './vr/license-reporter/license-reporter.component';
import {PlayerImportComponent} from './vr/player-import/player-import.component';
import {PlayerMergeImportComponent} from './vr/player-merge-import/player-merge-import.component';
import {TournamentStrengthComponent} from './tournament-strength/tournament-strength.component';
import {UtrReportComponent} from './utr-report/utr-report.component';
import {HomeComponent} from './home/home.component';
import {ExternalTournamentsComponent} from './external-tournaments/external-tournaments.component';
import {ItfExportsComponent} from './itf-exports/itf-exports.component';
import {PlayerCheckComponent} from './vr/player-check/player-check.component';
import {LoadWtnIdsComponent} from './vr/load-wtn-ids/load-wtn-ids.component';
import {WtnSyncReportComponent} from './wtn/wtn-sync-report/wtn-sync-report.component';
import {PlayReportComponent} from './play-reporter/play-report.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login/callback',
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
  { path: 'player_check',
    component: PlayerCheckComponent,
    canActivate: [ OktaAuthGuard ],
  },
  { path: 'tournament_strength',
    component: TournamentStrengthComponent,
    canActivate: [ OktaAuthGuard ],
  },
  { path: 'play_reporter',
    component: PlayReportComponent,
    canActivate: [ OktaAuthGuard ],
  },
  { path: 'utr_report',
    component: UtrReportComponent,
    canActivate: [ OktaAuthGuard ],
  },
  {
    path: 'external_data_admin',
    component: ExternalTournamentsComponent,
    canActivate: [ OktaAuthGuard ],
  },
  {
    path: 'itf_exports',
    component: ItfExportsComponent,
    canActivate: [ OktaAuthGuard ],
  },
  { path: 'wtn_uploader',
    component: LoadWtnIdsComponent,
    canActivate: [ OktaAuthGuard ],
  },
  { path: 'wtn_sync_report',
    component: WtnSyncReportComponent,
    canActivate: [ OktaAuthGuard ],
  },
  {
    path: 'player_check',
    component: PlayerCheckComponent,
    canActivate: [ OktaAuthGuard ],
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

