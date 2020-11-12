import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserClaims} from '@okta/okta-angular';
import {RIGHTS, StatsApp} from '../assets/stats-apps';

const OKTA_BC_MEMBERSHIP_GROUP = 'BC Membership';
const OKTA_TC_ADMIN_GROUP = 'Tennis Canada Admin';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  public activeTool$: BehaviorSubject<string>;
  userRights: boolean[] = [];

  constructor() {
    this.activeTool$ = new BehaviorSubject('None');
    this.userRights[RIGHTS.ADMIN] = false;
    this.userRights[RIGHTS.BC_MEMBERSHIP] = false;
  }

  setActiveTool(t: string) {
    this.activeTool$.next(t);
  }

  setRights(claims: UserClaims | undefined) {
    if (claims && claims.groups) {
      this.userRights[RIGHTS.ADMIN] = claims.groups.includes(OKTA_TC_ADMIN_GROUP);
      this.userRights[RIGHTS.BC_MEMBERSHIP] = claims.groups.includes(OKTA_BC_MEMBERSHIP_GROUP);
    } else {
      this.userRights[RIGHTS.ADMIN] = false;
      this.userRights[RIGHTS.BC_MEMBERSHIP] = false;
    }
  }

  hasRight(app: StatsApp) {
    for (const right of app.rights) {
      if (this.userRights[right]) {
        return true;
      }
    }
    return false;
  }
}
