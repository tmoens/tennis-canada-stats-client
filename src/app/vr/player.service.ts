import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { MessageService} from "../messages/message.service";
import { Observable, of} from "rxjs/index";
// @ts-ignore
import { environment } from '../../environments/environment';
import {PlayerMergeRecord} from "./player-merge-import/player-merge-import.component";

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
    private messageService: MessageService)
  { }

  //TODO Handle error;
  mergePlayers(mergeRecord: PlayerMergeRecord):Observable<string[]> {
    let url = `${this.serverURL}/Player/renumber`;
    return this.http.post<string[]>(url , mergeRecord, httpOptions);
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
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  private log(message: string) {
    this.messageService.add('Player Service: ' + message);
  }

}
