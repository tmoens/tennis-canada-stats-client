import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NgxUploaderModule } from 'ngx-uploader';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { VRLicenseManagerComponent } from './vr/vrlicense-manager/vrlicense-manager.component';
import { VRLicenseReporterComponent } from './vr/license-reporter/license-reporter.component';
import { PlayerImportComponent } from './vr/player-import/player-import.component';
import { PlayerMergeImportComponent } from './vr/player-merge-import/player-merge-import.component';
import { HomeComponent } from './home/home.component';
import { TournamentStrengthComponent } from './tournament-strength/tournament-strength.component';
import { UtrReportComponent } from './utr-report/utr-report.component';
import { ExternalTournamentsModule } from './external-tournaments/external-tournaments.module';
import { PlayerCheckComponent } from './vr/player-check/player-check.component';

import { PlayReportComponent } from './play-reporter/play-report.component';
import {AuthModule} from './auth/auth.module';
import {AppStateService} from './app-state.service';
import {UserAdminService} from './auth/user-admin/user-admin.service';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {AuthService} from './auth/auth.service';
import {CanDeactivateGuard} from './auth/guards/can-deactivate-guard';
import {LoginGuardService} from './auth/guards/login-guard.service';
import {RoleGuardService} from './auth/guards/role-guard.service';
import {AuthTokenInterceptor} from './auth/auth-token.interceptor';
import {DialogService} from './dialog.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {HttpErrorHandlerService} from './http-error-handler';
import {MatMenuModule} from '@angular/material/menu';
import { GraderComponent } from './grader/grader.component';
import {GraderService} from './grader/grader-service';
import {MatchCompetitivenessComponent} from './match-competitiveness/match-competitiveness.component';

export function appStateProviderFactory(provider: AppStateService) {
  return () => provider.initialize();
}

export function userAdminServiceProviderFactory(provider: UserAdminService) {
  return () => provider.initialize();
}

export function authServiceProviderFactory(provider: AppStateService) {
  return () => provider.initialize();
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayerImportComponent,
    MatchCompetitivenessComponent,
    PlayerMergeImportComponent,
    PlayerCheckComponent,
    PlayReportComponent,
    TournamentStrengthComponent,
    VRLicenseManagerComponent,
    VRLicenseReporterComponent,
    UtrReportComponent,
    GraderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MatButtonModule, MatCardModule, MatCheckboxModule,
    MatDatepickerModule, MatDialogModule, MatIconModule, MatExpansionModule,
    MatFormFieldModule, MatGridListModule,
    MatInputModule, MatListModule, MatOptionModule, MatProgressBarModule,
    MatRadioModule, MatSelectModule, MatStepperModule, MatTableModule,
    MatSidenavModule,
    MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatToolbarModule,
    NgxUploaderModule,
    ReactiveFormsModule,
    ExternalTournamentsModule,
    AppRoutingModule, AuthModule, MatMenuModule,
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: appStateProviderFactory, deps: [AppStateService], multi: true},
    {provide: APP_INITIALIZER, useFactory: userAdminServiceProviderFactory, deps: [UserAdminService, AppStateService], multi: true},
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: APP_INITIALIZER, useFactory: authServiceProviderFactory, deps: [AuthService], multi: true},
    CanDeactivateGuard,
    DialogService,
    LoginGuardService,
    RoleGuardService,
    GraderService,
    HttpErrorHandlerService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
