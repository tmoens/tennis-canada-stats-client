import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalPlayerManagerComponent } from './external-player-manager/external-player-manager.component';
import { ExternalTournamentService } from './external-tournament.service';
import { ResultsBrowserComponent } from './results-browser/results-browser.component';
import { ExternalTournamentsComponent } from './external-tournaments.component';
import { STATSTOOL } from '../../assets/stats-tools';
import { RoleGuardService as RoleGuard } from '../auth/guards/role-guard.service';
import { USER_ROLE } from '../auth/app-roles';

const routes: Routes = [
  {
    path: STATSTOOL.EXTERNAL_DATA_ADMIN.route,
    data: {
      permittedRole: USER_ROLE,
    },
    component: ExternalTournamentsComponent,
    children: [
      {
        path: 'idmapping',
        component: ExternalPlayerManagerComponent,
        canActivate: [RoleGuard],
        data: {
          permittedRole: USER_ROLE,
        },
      },
      {
        path: 'resultsBrowser',
        component: ResultsBrowserComponent,
        canActivate: [RoleGuard],
        data: {
          permittedRole: USER_ROLE,
        },
      },
      {
        path: '',
        component: ExternalPlayerManagerComponent,
        canActivate: [RoleGuard],
        data: {
          permittedRole: USER_ROLE,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ExternalTournamentService],
})
export class ExternalTournamentsRoutingModule {}
