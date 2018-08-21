import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import {
  MatButtonModule, MatCardModule, MatCheckboxModule,
  MatDatepickerModule, MatFormFieldModule, MatGridListModule, MatIconModule,
  MatInputModule, MatListModule, MatOptionModule,
  MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule,
  MatTableModule, MatToolbarModule, MatSidenavModule, MatSortModule
} from "@angular/material";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
// import {OktaAuthModule, OktaCallbackComponent, OktaAuthGuard} from "@okta/okta-angular";

import { AppComponent } from './app.component';
import {MessagesComponent} from "./messages/messages.component";
// import { LoginComponent } from './auth/login.component'
import { VRLicenseManagerComponent } from './vr/vrlicense-manager/vrlicense-manager.component';

import { TcStatsComponent } from './tc-stats/tc-stats.component';
import { LayoutModule } from '@angular/cdk/layout';
import { VRLicenseReporterComponent } from './vr/license-reporter/license-reporter.component';
import {MomentDateModule} from "@angular/material-moment-adapter";
import { PlayerImportComponent } from './vr/player-import/player-import.component';

// export function onAuthRequired({ oktaAuth, router }) {
//   // Redirect the user to your custom login page
//   router.navigate(['/login']);
// }

const routes: Routes = [
  // {
  //   path: 'implicit/callback',
  //   component: OktaCallbackComponent,
  // },
  { path: 'vr_license_manager',
    component: VRLicenseManagerComponent,
  },
  { path: 'vr_license_reporter',
    component: VRLicenseReporterComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    VRLicenseManagerComponent,
    MessagesComponent,
    TcStatsComponent,
    VRLicenseReporterComponent,
    PlayerImportComponent,
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
    MatDatepickerModule, MatIconModule, MatFormFieldModule, MatGridListModule,
    MatInputModule, MatListModule, MatOptionModule,
    MatSelectModule, MatTableModule, MatProgressSpinnerModule,
    MatSlideToggleModule, MatSortModule, MatToolbarModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MatSidenavModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
