/**
 * 2018-02-17 Ted Moens
 * This just intercepts the outbound http requests and inserts the jwt
 * More efficient than doing it in every single http request.
 *
 */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { OktaAuthService } from '@okta/okta-angular';
import { Observable, from } from 'rxjs';
import {mergeMap} from 'rxjs/operators';
@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor( private auth: OktaAuthService ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // This is nearly impenetrable.
    // The problem comes from the fact that getAccessToken is asynchronous.
    // It returns a promise which we first convert to an Observable using "from"
    // The mergeMap is very opaque. It "Projects each source value to an
    // Observable which is merged in the output Observable". In effect,
    // it allows us to wait for the getAccessToken to happen before we
    // clone and amend the request header.
    return from(this.auth.getAccessToken())
      .pipe(
        mergeMap ((token: string) => {
        if (token) {
          // If there is a token available, stick it in the request header.
          // If not, this interceptor is a no-op
          request = request.clone(
            {
              setHeaders: {Authorization: `Bearer ` + token}
            });
        }
        return next.handle(request);
      })
      );
  }
}
