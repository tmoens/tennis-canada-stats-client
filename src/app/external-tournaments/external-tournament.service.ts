import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import { ExternalPlayer } from './external-player-manager/external-player';
import { VRPlayer } from './VRPlayer';
import { ExternalEventResultDTO} from './results-browser/results-browser.component';
import { ResultFilter } from './results-browser/ResultFilter';
import { TournamentFilter } from './tournament-rater/tournament-filter';
import { environment } from '../../environments/environment';
import {ExternalTournament} from './external-tournament';
import {ExternalEvent} from './external-event';
import {plainToClass} from 'class-transformer';

const defaultHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ExternalTournamentService {

  private serverURL = environment.serverPrefix;

  constructor(
    private http: HttpClient,
  ) { }


  getFilteredTournaments(filter: TournamentFilter): Observable<ExternalTournament[]> {
    const options = { headers: defaultHeaders };
    let params: HttpParams = new HttpParams();
    const url = `${this.serverURL}/ExternalTournament/getFilteredTournaments`;
    Object.entries(filter).map(e => {
      if (e[1] && e[0]) {
        params = params.set(e[0], e[1]);
      }
    });
    options['params'] = params;

    return this.http.get<ExternalTournament[]>(url , options)
      .pipe( map(response => plainToClass(ExternalTournament, response)));
  }


  /** Get the events for a given tournament */
  getTournamentEvents(tournamentId: string): Observable<ExternalEvent[]> {
    if (tournamentId === '') { return of([]); }
    const url = `${this.serverURL}/ExternalTournament/${tournamentId}/Events`;
    return this.http.get<ExternalEvent[]>(url , httpOptions);
  }

  /** Set the sub-category of a tournament */
  // TODO This should not be a get operation.
  categorizeTournament(tournament: ExternalTournament): Observable<ExternalTournament> {
    const url =
      `${this.serverURL}/ExternalTournament/UpdateCategory/${tournament.tournamentId}/${encodeURIComponent(tournament.category)}`;
    return this.http.post<ExternalTournament>(url , httpOptions);
  }

  // ==================== EXTERNAL EVENTS =================================
  getFilteredResults(resultFilter: ResultFilter): Observable<ExternalEventResultDTO[]> {
    const options = { headers: defaultHeaders };
    let params: HttpParams = new HttpParams();
    const url = `${this.serverURL}/ExternalEventResult/GetFilteredResults`;
    let noFilters = true;
    Object.entries(resultFilter).map(e => {
      if (e[1] && e[0]) {
        noFilters = false;
        params = params.set(e[0], e[1]);
      }
    });
    if (!noFilters) {
      options['params'] = params;
    }

    return this.http.get<ExternalEventResultDTO[]>(url , options);
  }

  // ==================== EXTERNAL PLAYERS ==========================
  searchPlayers(searchString: string, onlyPlayersWithoutVRID: boolean): Observable<ExternalPlayer[]> {
    const options = { headers: defaultHeaders };
    const url = `${this.serverURL}/ExternalPlayer/GetExternalPlayers`;
    let params: HttpParams = new HttpParams();
    if (onlyPlayersWithoutVRID) {
      params = params.set('missingVRID', 'true');
    }
    if (searchString) {
      params = params.set('searchString', searchString);
    }
    options['params'] = params;
    return this.http.get(url, options)
      .pipe(map(response => response as ExternalPlayer[]));
  }

  // ==================== VR PLAYERS ==========================
  findVRMatches(ITFPlayerId): Observable<VRPlayer[]> {
    if (!ITFPlayerId) {
      // short circuit if no ITF player is selected when looking for matching VR players
      return of<VRPlayer[]>([]);
    }
    return this.http.get(this.serverURL + '/ExternalPlayer/FindVRMatches/' + ITFPlayerId, httpOptions)
      .pipe(map(response => response as VRPlayer[]));
      }

  getVRPlayerById(VRPlayerId): Promise<VRPlayer> {
    return this.http.get(this.serverURL + '/Player/' + VRPlayerId, httpOptions)
      .toPromise()
      .then(response => response as VRPlayer);
  }

  setExternalPlayerVRID(ITFPlayerID, newVRPlayerID): Promise<ExternalPlayer> {
    return this.http.put(this.serverURL +
      '/ExternalPlayer/SetVRId/' + ITFPlayerID +
      '/' + newVRPlayerID, httpOptions)
      .toPromise()
      .then(response => response as ExternalPlayer);
    // TODO catch errors
  }

  // When the user sets the external points won in an external event.
  overrideExternalPoints(er: ExternalEventResultDTO) {
    return this.http.post<ExternalEventResultDTO>(
      `${this.serverURL}/ExternalEventResult/overrideExternalPoints/`, er, httpOptions).pipe(
      tap((t: ExternalEventResultDTO) => this.log('Set manual points: ' + JSON.stringify(er))),
      catchError(this.handleError<ExternalEventResultDTO>('updateEvent', null))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  private log(message: string) {
    console.log('ExternalTournamentService: ' + message);
  }

}
