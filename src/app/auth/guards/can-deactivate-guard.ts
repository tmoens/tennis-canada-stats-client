import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';

/**
 * A service used to present a dialog box when a component (any component you want)
 * becomes inactive.
 *
 * For example, when an edit in progress and the user attempts to navigate away.
 * Any component that needs the "canDeactivate" service needs to
 * a) guard routes with canDeactivate: [CanDeactivateGuard ...] and
 * b) implement the following interface
 */

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate,
                route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot) {

    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
