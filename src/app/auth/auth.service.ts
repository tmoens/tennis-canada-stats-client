import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, interval} from 'rxjs';
import {Router} from '@angular/router';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
import {plainToClass} from 'class-transformer';
import {AccessTokenPayload} from './access-token-payload';
import {AppStateService} from '../app-state.service';
import {Roles} from './app-roles';
import {STATS_TOOL_GROUPS} from '../../assets/stats-tool-groups';
import {StatsToolGroup} from '../../assets/stats-tool-group';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public allToolGroups = STATS_TOOL_GROUPS;
  public authorizedToolGroups: StatsToolGroup[] = [];
  public intendedPath: string;

  public loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // This is used in case the GUI needs to know if the user has been authenticated, i.e. logged in.
  get isAuthenticated(): boolean {
    return this.loggedIn$.value;
  }

  private accessToken$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  get accessToken(): string {
    return this.accessToken$.value;
  }

  private tokenPayload: AccessTokenPayload = null;

  // other state information is just held in an indexed array
  constructor(
    private appState: AppStateService,
    private router: Router,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService,
  ) {
  }


  initialize() {
    // tight loop, every 60 seconds check if the access token has expired and if so,
    // redirect to home page. Prevents the user from trying something and then finding out that
    // their session has effectively timed out.
    const checkExpiry = interval(60000);
    checkExpiry.subscribe(_ => {
      if (this.isAuthenticated && this.isTokenExpired(this.accessToken)) {
        this.accessToken$.next(null);
        this.router.navigateByUrl('login').then();
      }
    });

    // On startup, use the token from local storage token (if there is one) as the access token.
    this.accessToken$.next(this.localStorage.get('access_token'));

    // Whenever the access token changes, do some work
    this.accessToken$.subscribe(
      (token: string) => {

        // wipe the cached token payload.
        this.tokenPayload = null;

        // Put a copy of the new token in local storage.
        this.localStorage.set('access_token', token);

        if (!token) {
          // if there was no token, broadcast the fact that the user has logged out.
          this.loggedIn$.next(false);
        } else if (this.isTokenExpired(token)) {

          // if the token is expired, (this could happen when a session is restarted and an
          // expired token is read from local storage) set it to null, effectively logging the user out.
          this.accessToken$.next(null);

          // 2023-03-17 this is not working.  So, ugh, we just do not force the password change.
          // } else if (this.decryptToken(token).passwordChangeRequired) {

          // If the user is supposed to change their password, force that.
          // this.router.navigateByUrl('/change_password').then();
        } else {

          // well, finally this looks like a good access token, so mark the user as logged in
          // and cache the token payload.
          this.loggedIn$.next(true);
          this.tokenPayload = this.decryptToken(token);

          // If the user was heading somewhere when they were forced to log in, go there now.
          if (this.intendedPath) {
            const path = this.intendedPath;
            this.intendedPath = null;
            this.router.navigateByUrl(path).then();
          }

          // If the user is just logging in to no path in particular
          if ('/login' === location.pathname) {
            this.router.navigateByUrl('/').then();
          }
        }
      });

    // in case the user is returning and there is a valid token.
    this.authorizedToolGroups = this.computeAuthorizedTools();
  }

  onLogin(token) {
    this.accessToken$.next(token);
    this.authorizedToolGroups = this.computeAuthorizedTools();
  }

  onLogout() {
    this.accessToken$.next(null);
    this.authorizedToolGroups = this.computeAuthorizedTools();
  }

  onLoginFailed() {
    this.onLogout();
  }


  // this decodes the access token and stuffs it in typed object.
  decryptToken(token): AccessTokenPayload {
    if (token) {
      return plainToClass(AccessTokenPayload, JSON.parse(atob(token.split('.')[1])));
    } else {
      return null;
    }
  }

  // find out if the token will expire within the next 65 seconds.
  isTokenExpired(token): boolean {
    const tokenPayload: AccessTokenPayload = this.decryptToken(token);
    if (tokenPayload && tokenPayload.exp) {
      const d = new Date(0);
      d.setUTCSeconds(tokenPayload.exp);
      return d.valueOf() <= new Date().valueOf() + 65000;
    } else {
      // no token or no token expiry - deemed expired
      return true;
    }
  }

  // Check if the logged in user is allowed to perform a particular role.
  canPerformRole(roleInQuestion: string): boolean {
    if (!this.isAuthenticated) {
      return false;
    } else {
      return Roles.isAuthorized(this.decryptToken(this.accessToken).role, roleInQuestion);
    }
  }

  getLoggedInUserName(): string {
    return (this.isAuthenticated) ? this.tokenPayload.username : null;
  }

  loggedInUserId(): string {
    return (this.isAuthenticated) ? this.tokenPayload.sub : null;
  }

  computeAuthorizedTools(): StatsToolGroup[] {
    const authorizedToolGroups: StatsToolGroup[] = [];
    if (this.isAuthenticated) {
      for (const tg of this.allToolGroups) {
        // make a copy of the tool group because not all of the tools in the group
        // may be authorized and we dont want to alter the actual tool group
        const authorizedTg = {...tg};
        authorizedTg.tools = [];
        for (const tool of tg.tools) {
          if (this.canPerformRole(tool.requiredRole)) {
            authorizedTg.tools.push(tool);
          }
        }
        // If some of the tools in the group are authorized, the group is authorized
        if (authorizedTg.tools.length > 0) {
          authorizedToolGroups.push(authorizedTg);
        }
      }
    }
    return authorizedToolGroups;
  }
}
