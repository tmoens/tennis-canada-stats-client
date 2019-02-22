import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalTournamentsRoutingModule } from './external-tournaments-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule,
  MatNativeDateModule,
  MatOptionModule,
  MatProgressBarModule, MatRadioModule,
  MatSelectModule, MatSlideToggleModule,
  MatTableModule, MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {MomentDateModule} from "@angular/material-moment-adapter";
import {ExternalPlayerManagerComponent} from "./external-player-manager/external-player-manager.component";
import {ResultsBrowserComponent} from "./results-browser/results-browser.component";
import {TournamentRaterComponent} from "./tournament-rater/tournament-rater.component";
import { ExternalTournamentsComponent } from './external-tournaments.component';

@NgModule({
  declarations: [
    ExternalPlayerManagerComponent,
    ResultsBrowserComponent,
    TournamentRaterComponent,
    ExternalTournamentsComponent,
  ],
  imports: [
    CommonModule,
    ExternalTournamentsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatListModule, MatNativeDateModule,
    MatOptionModule, MatRadioModule, MatSelectModule, MatTabsModule, MatToolbarModule,
    MatTableModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    MomentDateModule,
  ]
})
export class ExternalTournamentsModule { }
