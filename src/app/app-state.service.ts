import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/Rx";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  public activeTool$: BehaviorSubject<string>;

  constructor() {
    this.activeTool$ = new BehaviorSubject("None");
  }

  setActiveTool(t: string) {
    this.activeTool$.next(t);
  }
}
