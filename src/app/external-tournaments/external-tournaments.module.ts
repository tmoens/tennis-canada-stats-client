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
  MatProgressBarModule,
  MatSelectModule, MatSlideToggleModule,
  MatTableModule, MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";
import {MomentDateModule} from "@angular/material-moment-adapter";
import {ExternalPlayerManagerComponent} from "./external-player-manager/external-player-manager.component";
import {EventDetailEditorComponent} from "./event-detail-editor/event-detail-editor.component";
import {EventResultEditorComponent} from "./event-result-editor/event-result-editor.component";
import {ResultsBrowserComponent} from "./results-browser/results-browser.component";
import {TournamentDetailEditorComponent} from "./tournament-detail-editor/tournament-detail-editor.component";
import {TournamentNavigatorComponent} from "./tournament-navigator/tournament-navigator.component";
import {TournamentRaterComponent} from "./tournament-rater/tournament-rater.component";
import { ExternalTournamentsComponent } from './external-tournaments.component';

@NgModule({
  declarations: [
    ExternalPlayerManagerComponent,
    EventDetailEditorComponent,
    EventResultEditorComponent,
    ResultsBrowserComponent,
    TournamentDetailEditorComponent,
    TournamentNavigatorComponent,
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
    MatOptionModule, MatSelectModule, MatTabsModule, MatToolbarModule,
    MatTableModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    MomentDateModule,
  ]
})
export class ExternalTournamentsModule { }
