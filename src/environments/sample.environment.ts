// An example config file for development
// the redirect uri has to be configured in the Okta admin area
// the server prefix is wherever you configured your apache server to
// redirect http request to your tc_stats server.
export const environment = {
  production: false,
  oktaEnv: {
    issuer: 'https://dev-574317.oktapreview.com/oauth2/default',
    redirectUri: 'http://localhost:4201/implicit/callback',
    clientId: '0oaf4igrrdiZLXT1Q0h7',
    scope: 'openid email phone groups',
  },
  serverPrefix: 'https://localhost/however_you_configured_the_stats_server'
};

