import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalTournamentsRoutingModule } from './external-tournaments-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
