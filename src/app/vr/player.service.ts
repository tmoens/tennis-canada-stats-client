import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { environment } from '../../environments/environment';
import {PlayerMergeRecord, PlayerMergeResult} from './player-merge-import/player-merge-import.component';
import {ITFMatchDTO, ITFPlayerDTO} from '../itf-exports/itf-exports.component';

const defaultHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VRPlayerService {
  private serverURL = environment.serverPrefix;

  constructor(
    private http: HttpClient,
    ) {
  }

  // TODO Handle error;
  mergePlayers(mergeRecord: PlayerMergeRecord): Observable<PlayerMergeResult> {
    const url = `${this.serverURL}/Player/renumber`;
    return this.http.post<PlayerMergeResult>(url , mergeRecord, httpOptions);
  }

  getPlayerDataForITF(): Observable<ITFPlayerDTO[]> {
    return this.http.get<ITFPlayerDTO[]>(this.serverURL + '/Player/ITFPlayerData', httpOptions);
  }

  getITFMatchData(updatedSinceString): Observable<ITFMatchDTO[]> {
    let params: HttpParams = new HttpParams();
    params = params.set('updatedSince', updatedSinceString);
    const options = { headers: defaultHeaders };
    options['params'] = params;
    return this.http.get<ITFMatchDTO[]>(this.serverURL + '/Exports/ITFMatchData', options);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: better job of transforming error for user consumption

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
