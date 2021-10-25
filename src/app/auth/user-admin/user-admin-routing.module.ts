import {RouterModule, Routes} from '@angular/router';
import {STATSTOOL} from '../../../assets/stats-tools';
import {UserAdminComponent} from './user-admin.component';
import {UserViewerComponent} from './user-viewer/user-viewer.component';
import {EditMode, UserEditorComponent} from './user-editor/user-editor.component';
import {CanDeactivateGuard} from '../guards/can-deactivate-guard';
import {RoleGuardService as RoleGuard} from '../guards/role-guard.service';
import {ADMIN_ROLE} from '../app-roles';
import {NgModule} from '@angular/core';

const userAdminRoutes: Routes = [
  {
    path: STATSTOOL.USER_MANAGER.route,
    component: UserAdminComponent,
    children: [
      {
        path: '',
        component: UserViewerComponent,
        canActivate: [RoleGuard],
        data: {
          permittedRole: ADMIN_ROLE
        }
      },
      {
        path: 'view',
        component: UserViewerComponent,
        canActivate: [RoleGuard],
        data: {
          permittedRole: ADMIN_ROLE
        }
      },
      {
        path: 'view/:id',
        component: UserViewerComponent,
        canActivate: [RoleGuard],
        data: {
          permittedRole: ADMIN_ROLE
        }
      },
      {
        path: EditMode.CREATE,
        component: UserEditorComponent,
        canDeactivate: [CanDeactivateGuard],
        canActivate: [RoleGuard],
        data: {
          permittedRole: ADMIN_ROLE
        }
      },
      {
        path: EditMode.EDIT,
        component: UserEditorComponent,
        canDeactivate: [CanDeactivateGuard],
        canActivate: [RoleGuard],
        data: {
          permittedRole: ADMIN_ROLE
        }
      },
      {
        path: EditMode.EDIT + '/:id',
        component: UserEditorComponent,
        canDeactivate: [CanDeactivateGuard],
        canActivate: [RoleGuard],
        data: {
          permittedRole: ADMIN_ROLE
        }
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(userAdminRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class UserAdminRoutingModule { }
