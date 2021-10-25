import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';
import {STATSTOOL} from '../assets/stats-tools';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  state: { [name: string]: any } = {};
  persistentState: { [name: string]: any } = {};

  private _activeTool$: BehaviorSubject<STATSTOOL> = new BehaviorSubject<STATSTOOL>(STATSTOOL.HOME);
  private get activeTool$() {
    return this._activeTool$;
  }

  public get activeTool() {
    return this.activeTool$.value;
  }

  constructor(
    private router: Router,
    @Inject(LOCAL_STORAGE)private localStorage: StorageService,
  ) {
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
      this.setState('errorMessageDuration', 10000);
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

  setState(name: string, value: any, persist: boolean = false) {
    if (persist) {
      this.persistentState[name] = value;
    } else {
      this.state[name] = value;
    }
  }

  deleteState(name: string) {
    if (this.persistentState[name]) { delete this.persistentState[name]; }
    if (this.state[name]) { delete this.state[name]; }
  }

  getState(name): any {
    if (this.persistentState[name]) { return this.persistentState[name]; }
    if (this.state[name]) { return this.state[name]; }
    return null;
  }

}
