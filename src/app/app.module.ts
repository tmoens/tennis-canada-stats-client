import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import {
  MatButtonModule, MatCardModule, MatCheckboxModule,
  MatDatepickerModule, MatFormFieldModule, MatGridListModule, MatIconModule,
  MatInputModule, MatListModule, MatOptionModule, MatProgressBarModule,
  MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule, MatStepperModule,
  MatTableModule, MatToolbarModule, MatSidenavModule, MatSortModule
} from "@angular/material";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import {MessagesComponent} from "./messages/messages.component";
import { VRLicenseManagerComponent } from './vr/vrlicense-manager/vrlicense-manager.component';

import { LayoutModule } from '@angular/cdk/layout';
import { VRLicenseReporterComponent } from './vr/license-reporter/license-reporter.component';
import {MomentDateModule} from "@angular/material-moment-adapter";
import { PlayerImportComponent } from './vr/player-import/player-import.component';
import {NgxUploaderModule} from "ngx-uploader";
import {PlayerMergeImportComponent} from "./vr/player-merge-import/player-merge-import.component";

import {OktaAuthGuard, OktaAuthModule, OktaCallbackComponent} from "@okta/okta-angular";


import { environment } from '../environments/environment';
import {LoginComponent} from "./auth/login.component";
import { HomeComponent } from './home/home.component';

export function onAuthRequired({ oktaAuth, router }) {
  // Redirect the user to your custom login page
  router.navigate(['/login']);
}

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
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
    data: {
      onAuthRequired
    }
  },
  { path: 'vr_license_reporter',
    component: VRLicenseReporterComponent,
    canActivate: [ OktaAuthGuard ],
    data: {
      onAuthRequired
    }
  },
  { path: 'player_import',
    component: PlayerImportComponent,
    canActivate: [ OktaAuthGuard ],
    data: {
      onAuthRequired
    }
  },
  { path: 'player_merge_import',
    component: PlayerMergeImportComponent,
    canActivate: [ OktaAuthGuard ],
    data: {
      onAuthRequired
    }
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MessagesComponent,
    PlayerImportComponent,
    PlayerMergeImportComponent,
    VRLicenseManagerComponent,
    VRLicenseReporterComponent,
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
    MatSelectModule, MatStepperModule, MatTableModule,
    MatSidenavModule, MatProgressBarModule, MatProgressSpinnerModule,
    MatSlideToggleModule, MatSortModule, MatToolbarModule,
    NgxUploaderModule,
    OktaAuthModule.initAuth(environment.oktaEnv),
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
