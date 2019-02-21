import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { ExternalTournament } from './tournament-detail-editor/external-tournament';
import { ExternalEvent } from './event-detail-editor/external-event';
import { EventResult } from './event-result-editor/event-result-editor.component';
import { ExternalPlayer } from './external-player-manager/external-player';
import { VRPlayer } from './VRPlayer';
import { ExternalEventResultDTO} from './results-browser/results-browser.component';
import { ResultFilter } from './results-browser/ResultFilter';
import { TournamentFilter } from './tournament-rater/tournament-filter';
import { environment } from '../../environments/environment';

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

  // ==================== EXTERNAL TOURNAMENTS =================================
  /** PUT: add a new tournament to the server */
  addTournament (t: ExternalTournament): Observable<ExternalTournament> {
    return this.http.put<ExternalTournament>(`${this.serverURL}/ExternalTournament/`, t, httpOptions).pipe(
      tap((t: ExternalTournament) => this.log(`added tournament w/ id=${t.tournamentId}`)),
      catchError(this.handleError<ExternalTournament>('addTournament'))
    );
  }

  /** POST: add a new tournament to the server */
  updateTournament (t: ExternalTournament): Observable<ExternalTournament> {
    return this.http.post<ExternalTournament>(`${this.serverURL}/ExternalTournament/`, t, httpOptions).pipe(
      tap((t: ExternalTournament) => this.log(`added tournament w/ id=${t.tournamentId}`)),
      catchError(this.handleError<ExternalTournament>('updateTournament'))
    );
  }

  /** DELETE: delete the tournament from the server */
  deleteTournament (id: string): Observable<any> {
    const url = `${this.serverURL}/ExternalTournament/${id}`;
    return this.http.delete(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted tournament id=${id}`)),
        catchError(this.handleError<string>('deleteTournament'))
      );
  }

  getFilteredTournaments(filter:TournamentFilter):Observable<ExternalTournament[]> {
    let options = { headers: defaultHeaders };
    let params: HttpParams = new HttpParams();
    let url = `${this.serverURL}/ExternalTournament/getFilteredTournaments`;
    Object.entries(filter).map(e => {
      if (e[1] && e[0]) {
        params = params.set(e[0],e[1]);
      }
    });
    options['params'] = params;

    return this.http.get<ExternalTournament[]>(url , options)
      .map(response => response as ExternalTournament[]);
  }


  getManualTournaments(searchString: string): Observable<ExternalTournament[]> {
    let url = `${this.serverURL}/ExternalTournament/searchManualTournaments/${searchString}`;
    return this.http.get<ExternalTournament[]>(url , httpOptions)
      .map(response => response['ExternalTournaments']);
  };

  /** Get the events for a given tournament */
  getTournamentEvents(tournamentId:string):Observable<ExternalEvent[]> {
    if (tournamentId == "") return Observable.of([]);
    let url = `${this.serverURL}/ExternalTournament/${tournamentId}/Events`;
    return this.http.get<ExternalEvent[]>(url , httpOptions)
      .map(response => response['ExternalEvents']);
  }

  /** Set the sub-category of a tournament */
  // TODO This should not be a get operation.
  categorizeTournament(tournamentId: string, subCategory:string):Observable<ExternalTournament> {
    let url =
      `${this.serverURL}/ExternalTournament/UpdateSubCategory/${tournamentId}/${encodeURIComponent(subCategory)}`;
    return this.http.post<ExternalTournament>(url , httpOptions);
  }

  // ==================== EXTERNAL EVENTS =================================
  /** PUT: add a new event to the server */
  addEvent (t: ExternalEvent): Observable<ExternalEvent> {
    return this.http.put<ExternalEvent>(`${this.serverURL}/ExternalEvent/`, t, httpOptions).pipe(
      tap((t: ExternalEvent) => this.log(`added event w/ id=${t.eventId}`)),
      catchError(this.handleError<ExternalEvent>('addEvent'))
    );
  }

  /** POST: add a new event to the server */
  updateEvent (t: ExternalEvent): Observable<ExternalEvent> {
    return this.http.post<ExternalEvent>(`${this.serverURL}/ExternalEvent/`, t, httpOptions).pipe(
      tap((t: ExternalEvent) => this.log(`added event w/ id=${t.eventId}`)),
      catchError(this.handleError<ExternalEvent>('updateEvent'))
    );
  }

  /** DELETE: delete the event from the server */
  deleteEvent (id: string): Observable<any> {
    const url = `${this.serverURL}/ExternalEvent/${id}`;
    this.log("Trying to delete event " + id);
    return this.http.delete(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted event id=${id}`)),
        catchError(this.handleError<string>('deleteEvent'))
      );
  }

  /** Get the events results for a given event */
  getEventResults(eventId:string):Observable<EventResult[]> {
    if (eventId == "") return Observable.of([]);
    let url = `${this.serverURL}/ExternalEvent/${eventId}/ResultsWithPlayers`;
    return this.http.get<EventResult[]>(url , httpOptions)
      .map(response => response['ExternalEventResults']);
  }


  // ==================== EXTERNAL EVENT RESULTS ==========================
  deleteEventResult (eventId: string, playerId: string): Observable<any> {
    const url = `${this.serverURL}/ExternalEventResult/${eventId}/${playerId}`;
    return this.http.delete(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted eventId=${eventId} playerId=${playerId}`)),
        catchError(this.handleError<string>('deleteEvent'))
      );
  }
  addEventResult (t: EventResult): Observable<EventResult> {
    return this.http.put<EventResult>(`${this.serverURL}/ExternalEventResult/`, t, httpOptions).pipe(
      tap((t: EventResult) => this.log(`added event w/ id=${t.eventId}`)),
      catchError(this.handleError<EventResult>('addEvent'))
    );
  }

  updateEventResult (t: EventResult): Observable<EventResult> {
    return this.http.post<EventResult>(`${this.serverURL}/ExternalEventResult/`, t, httpOptions).pipe(
      tap((t: EventResult) => this.log(`added event w/ id=${t.eventId}`)),
      catchError(this.handleError<EventResult>('updateEvent'))
    );
  }

  getFilteredResults(resultFilter:ResultFilter):Observable<ExternalEventResultDTO[]> {
    let options = { headers: defaultHeaders };
    let params: HttpParams = new HttpParams();
    let url = `${this.serverURL}/ExternalEventResult/GetFilteredResults`;
    let noFilters:boolean = true;
    Object.entries(resultFilter).map(e => {
      if (e[1] && e[0]) {
        noFilters = false;
        params = params.set(e[0],e[1]);
      }
    });
    if (!noFilters) {
      options['params'] = params;
    }

    return this.http.get<ExternalEventResultDTO[]>(url , options)
       .map(response => response as ExternalEventResultDTO[]);
  }

  // ==================== EXTERNAL PLAYERS ==========================
  searchPlayers(searchString: string, onlyPlayersWithoutVRID: boolean): Observable<ExternalPlayer[]> {
    let options = { headers: defaultHeaders };
    let url = `${this.serverURL}/ExternalPlayer/GetExternalPlayers`;
    let params: HttpParams = new HttpParams();
    if (onlyPlayersWithoutVRID) {
      params = params.set('missingVRID',"true");
    }
    if (searchString) {
      params = params.set('searchString', searchString);
    }
    options['params'] = params;
    return this.http.get(url, options)
      .map(response => response as ExternalPlayer[]);
  };

  // ==================== VR PLAYERS ==========================
  findVRMatches(ITFPlayerId): Observable<VRPlayer[]> {
    if (!ITFPlayerId) {
      // short circuit if no ITF player is selected when looking for matching VR players
      return of<VRPlayer[]>([]);
    }
    return this.http.get(this.serverURL + "/ExternalPlayer/FindVRMatches/" + ITFPlayerId, httpOptions)
      .map(response => response as VRPlayer[]);
      };

  getVRPlayerById(VRPlayerId): Promise<VRPlayer> {
    return this.http.get(this.serverURL + "/Player/" + VRPlayerId, httpOptions)
      .toPromise()
      .then(response => response as VRPlayer);
  };

  setExternalPlayerVRID(ITFPlayerID, newVRPlayerID): Promise<ExternalPlayer> {
    return this.http.put(this.serverURL +
      "/ExternalPlayer/SetVRId/" + ITFPlayerID +
      "/" + newVRPlayerID, httpOptions)
      .toPromise()
      .then(response => response as ExternalPlayer);
    //TODO catch erros
  }

  // When the user sets the external points won in an external event.
  overrideExternalPoints(er: ExternalEventResultDTO) {
    return this.http.post<ExternalEventResultDTO>(
      `${this.serverURL}/ExternalEventResult/overrideExternalPoints/`, er, httpOptions).pipe(
      tap((t: ExternalEventResultDTO) => this.log('Set manual points: ' + JSON.stringify(er))),
      catchError(this.handleError<EventResult>('updateEvent', null))
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
