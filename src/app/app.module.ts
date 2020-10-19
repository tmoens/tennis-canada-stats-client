import { BrowserModule } from '@angular/platform-browser';
import {FlexLayoutModule} from '@angular/flex-layout';
import { NgModule } from '@angular/core';
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
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { VRLicenseManagerComponent } from './vr/vrlicense-manager/vrlicense-manager.component';

import { LayoutModule } from '@angular/cdk/layout';
import { VRLicenseReporterComponent } from './vr/license-reporter/license-reporter.component';
import {MomentDateModule} from '@angular/material-moment-adapter';
import { PlayerImportComponent } from './vr/player-import/player-import.component';
import {NgxUploaderModule} from 'ngx-uploader';
import {PlayerMergeImportComponent} from './vr/player-merge-import/player-merge-import.component';

import { OktaAuthModule } from '@okta/okta-angular';


import { environment } from '../environments/environment';
import { LoginComponent } from './auth/login.component';
import { HomeComponent } from './home/home.component';
import { AuthTokenInterceptor } from './auth/AuthTokenInterceptor';
import { TournamentStrengthComponent } from './tournament-strength/tournament-strength.component';
import { UtrReportComponent } from './utr-report/utr-report.component';
import { AppRoutingModule } from './app-routing.module';
import { ExternalTournamentsModule } from './external-tournaments/external-tournaments.module';
import { ItfExportsComponent } from './itf-exports/itf-exports.component';
import {PlayerCheckComponent} from './vr/player-check/player-check.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

export function onAuthRequired({ oktaAuth, router }) {
  // Redirect the user to your custom login page
  router.navigate(['/login']);
}

// Shorthand for always using the onAuthRequired function for every guarded route
environment.oktaEnv['onAuthRequired'] = onAuthRequired;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ItfExportsComponent,
    LoginComponent,
    PlayerImportComponent,
    PlayerMergeImportComponent,
    PlayerCheckComponent,
    TournamentStrengthComponent,
    VRLicenseManagerComponent,
    VRLicenseReporterComponent,
    UtrReportComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MomentDateModule,
    MatButtonModule, MatCardModule, MatCheckboxModule,
    MatDatepickerModule, MatIconModule, MatExpansionModule,
    MatFormFieldModule, MatGridListModule,
    MatInputModule, MatListModule, MatOptionModule, MatProgressBarModule,
    MatRadioModule, MatSelectModule, MatStepperModule, MatTableModule,
    MatSidenavModule,
    MatSlideToggleModule, MatSortModule, MatToolbarModule,
    NgxUploaderModule,
    OktaAuthModule.initAuth(environment.oktaEnv),
    ReactiveFormsModule,
    ExternalTournamentsModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
