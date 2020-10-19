// An example config file for development
// the redirect uri has to be configured in the octa admin area
// the server prefix is wherever you configured your apache server to
// redirect http request to your node server.
export const environment = {
  production: false,
  oktaEnv: {
    issuer: 'https://dev-574317.oktapreview.com/oauth2/default',
    redirectUri: 'http://localhost:4201/implicit/callback',
    clientId: '0oaf4igrrdiZLXT1Q0h7',
    scope: 'openid email phone groups',
  },
  serverPrefix: 'http://feb2017/node'
};

