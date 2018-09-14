// the default config file
export const environment = {
  production: false,
  oktaEnv: {
    issuer: 'https://dev-574317.oktapreview.com/oauth2/default',
    redirectUri: 'http://localhost:4201/implicit/callback',
    clientId: '0oaf4igrrdiZLXT1Q0h7',
    scope: 'openid email phone groups',
  },
  serverPrefix: 'http://localhost:3002'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
