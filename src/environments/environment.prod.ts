export const environment = {
  production: true,
  oktaEnv: {
    issuer: 'https://dev-574317.oktapreview.com/oauth2/default',
    redirectUri: 'http://localhost/TCStatsClient/implicit/callback',
    clientId: '0oaf4igrrdiZLXT1Q0h7',
    scope: 'openid email phone groups',
  },
  serverPrefix: 'http://localhost:3002'
};
