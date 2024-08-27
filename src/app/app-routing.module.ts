import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VRLicenseManagerComponent } from './vr/vrlicense-manager/vrlicense-manager.component';
import { VRLicenseReporterComponent } from './vr/license-reporter/license-reporter.component';
import { PlayerImportComponent } from './vr/player-import/player-import.component';
import { PlayerMergeImportComponent } from './vr/player-merge-import/player-merge-import.component';
import { TournamentStrengthComponent } from './tournament-strength/tournament-strength.component';
import { UtrReportComponent } from './utr-report/utr-report.component';
import { HomeComponent } from './home/home.component';
import { ExternalTournamentsComponent } from './external-tournaments/external-tournaments.component';
import { PlayReportComponent } from './play-reporter/play-report.component';
import { CanDeactivateGuard } from './auth/guards/can-deactivate-guard';
import { RoleGuardService as RoleGuard } from './auth/guards/role-guard.service';
import { GUEST_ROLE, USER_ROLE } from './auth/app-roles';
import { GraderComponent } from './grader/grader.component';
import { MatchCompetitivenessComponent } from './match-competitiveness/match-competitiveness.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: GUEST_ROLE,
    },
  },
  {
    path: 'home',
    component: HomeComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: GUEST_ROLE,
    },
  },
  {
    path: 'vr_license_manager',
    component: VRLicenseManagerComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: USER_ROLE,
    },
  },
  {
    path: 'vr_license_reporter',
    component: VRLicenseReporterComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: USER_ROLE,
    },
  },
  {
    path: 'player_import',
    component: PlayerImportComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: USER_ROLE,
    },
  },
  {
    path: 'player_merge_import',
    component: PlayerMergeImportComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: USER_ROLE,
    },
  },
  {
    path: 'tournament_strength',
    component: TournamentStrengthComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: USER_ROLE,
    },
  },
  {
    path: 'match_competitiveness',
    component: MatchCompetitivenessComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: USER_ROLE,
    },
  },
  {
    path: 'play_reporter',
    component: PlayReportComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: USER_ROLE,
    },
  },
  {
    path: 'utr_report',
    component: UtrReportComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: USER_ROLE,
    },
  },
  {
    path: 'external_data_admin',
    component: ExternalTournamentsComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: USER_ROLE,
    },
  },
  {
    path: 'grader',
    component: GraderComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [RoleGuard],
    data: {
      permittedRole: USER_ROLE,
    },
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
