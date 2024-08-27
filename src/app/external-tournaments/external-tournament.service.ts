import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ExternalPlayer } from './external-player-manager/external-player';
import { VRPlayer } from './VRPlayer';
import { ResultFilter } from './results-browser/result-filter';
import { environment } from '../../environments/environment';
import { ExternalEventResultDTO } from './results-browser/external-event.dto';
import { HttpErrorHandlerService } from '../http-error-handler';

const defaultHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class ExternalTournamentService {
  private serverURL = environment.serverPrefix;

  constructor(
    private http: HttpClient,
    private errorHandlerService: HttpErrorHandlerService
  ) {}

  // ==================== EXTERNAL EVENTS =================================
  getFilteredResults(
    resultFilter: ResultFilter
  ): Observable<ExternalEventResultDTO[]> {
    const options = { headers: defaultHeaders };
    let params: HttpParams = new HttpParams();
    const url = `${this.serverURL}/ExternalEventResult/GetFilteredResults`;
    let noFilters = true;
    Object.entries(resultFilter).map((e) => {
      if (e[1] && e[0]) {
        noFilters = false;
        params = params.set(e[0], e[1]);
      }
    });
    if (!noFilters) {
      options['params'] = params;
    }

    return this.http.get<ExternalEventResultDTO[]>(url, options);
  }

  // ==================== EXTERNAL PLAYERS ==========================
  searchPlayers(
    searchString: string,
    onlyPlayersWithoutVRID: boolean
  ): Observable<ExternalPlayer[]> {
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
    return this.http
      .get(url, options)
      .pipe(map((response) => response as ExternalPlayer[]));
  }

  // ==================== VR PLAYERS ==========================
  findVRMatches(ITFPlayerId: string): Observable<VRPlayer[]> {
    if (!ITFPlayerId) {
      // short circuit if no ITF player is selected when looking for matching VR players
      return of<VRPlayer[]>([]);
    }
    return this.http
      .get(
        this.serverURL + '/ExternalPlayer/FindVRMatches/' + ITFPlayerId,
        httpOptions
      )
      .pipe(map((response) => response as VRPlayer[]));
  }

  getVRPlayerById(VRPlayerId: string): Promise<VRPlayer> {
    return firstValueFrom(
      this.http.get<VRPlayer>(
        this.serverURL + '/Player/' + VRPlayerId,
        httpOptions
      )
    );
  }

  setExternalPlayerVRID(
    ITFPlayerID: string,
    newVRPlayerID: string
  ): Promise<ExternalPlayer> {
    return firstValueFrom(
      this.http.put<ExternalPlayer>(
        this.serverURL +
          '/ExternalPlayer/SetVRId/' +
          ITFPlayerID +
          '/' +
          newVRPlayerID,
        httpOptions
      )
    );
  }

  // When the user sets the external points won in an external event.
  overrideExternalPoints(er: ExternalEventResultDTO) {
    return this.http
      .post<ExternalEventResultDTO>(
        `${this.serverURL}/ExternalEventResult/overrideExternalPoints/`,
        er,
        httpOptions
      )
      .pipe(
        tap((_: ExternalEventResultDTO) =>
          console.log('Set manual points: ' + JSON.stringify(er))
        ),
        catchError(
          this.errorHandlerService.handleError<ExternalEventResultDTO>(
            'updateEvent',
            null
          )
        )
      );
  }
}
