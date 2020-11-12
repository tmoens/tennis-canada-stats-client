import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { MomentDateModule } from '@angular/material-moment-adapter';

import { NgxUploaderModule } from 'ngx-uploader';
import { OKTA_CONFIG, OktaAuthModule, OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';


import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { VRLicenseManagerComponent } from './vr/vrlicense-manager/vrlicense-manager.component';
import { VRLicenseReporterComponent } from './vr/license-reporter/license-reporter.component';
import { PlayerImportComponent } from './vr/player-import/player-import.component';
import { PlayerMergeImportComponent } from './vr/player-merge-import/player-merge-import.component';
import { LoginComponent } from './auth/login.component';
import { HomeComponent } from './home/home.component';
import { AuthTokenInterceptor } from './auth/AuthTokenInterceptor';
import { TournamentStrengthComponent } from './tournament-strength/tournament-strength.component';
import { UtrReportComponent } from './utr-report/utr-report.component';
import { ExternalTournamentsModule } from './external-tournaments/external-tournaments.module';
import { ItfExportsComponent } from './itf-exports/itf-exports.component';
import { PlayerCheckComponent } from './vr/player-check/player-check.component';
import {Router} from '@angular/router';

import { environment } from '../environments/environment';

const oktaConfig = Object.assign({
  onAuthRequired: (oktaAuth, injector) => {
    const router = injector.get(Router);
    router.navigate(['/login']);
  }
}, environment.oidc);


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
    OktaAuthModule,
    ReactiveFormsModule,
    ExternalTournamentsModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: OKTA_CONFIG, useValue: oktaConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
