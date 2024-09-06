import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { STATSTOOL } from '../assets/stats-tools';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  state: Record<string, any> = {};
  persistentState: Record<string, any> = {};

  constructor(
    private router: Router,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService
  ) {}

  public get activeTool() {
    return this.activeTool$.value;
  }

  private _activeTool$: BehaviorSubject<STATSTOOL> =
    new BehaviorSubject<STATSTOOL>(STATSTOOL.HOME);

  private get activeTool$() {
    return this._activeTool$;
  }

  initialize() {
    // load up the persistentState
    if (this.localStorage.get('persistentState')) {
      this.persistentState = this.localStorage.get('persistentState');
    }
    if (!this.getState('confirmMessageDuration')) {
      this.setState('confirmMessageDuration', 2000);
    }
    if (!this.getState('errorMessageDuration')) {
      this.setState('errorMessageDuration', 4000);
    }
    if (!environment.serverPrefix) {
      throw new Error('serverPrefix needs to be set in your environment.');
    } else {
      this.setState('serverPrefix', environment.serverPrefix);
    }
  }

  setActiveTool(tool: STATSTOOL) {
    this._activeTool$.next(tool);
  }

  setState(name: string, value: any, persist = false) {
    if (persist) {
      this.persistentState[name] = value;
    } else {
      this.state[name] = value;
    }
  }

  getState(name): any {
    if (this.persistentState[name]) {
      return this.persistentState[name];
    }
    if (this.state[name]) {
      return this.state[name];
    }
    return null;
  }
}
