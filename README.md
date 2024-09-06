# TC Stats Client

This is the front-end for the companion server project TC Stats Server.

It provides a small set of GUI Tools that provide
Tennis Canada with a number of tools for managing and analysing
competitive tennis programs. The tools are collectively known as
the Tennis Canada Stats Admin Client.

This client is written in Angular/Typescript and use Angular Material which
provides the basic GUI Components, Themes and Typography.

The client accesses the server via https calls and uses JWT for security.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4201/`.
The app will automatically reload if you change any of the source files.

ng serve is never used in production.

## Build

Run `ng build` to build the project.
The build artifacts will be stored in the `dist/` directory.
Use the `--prod` flag for a production build.

## Linting

The system is configured to use eslint.
At this time you have to run eslint directly.
ng lint configuration proved unsuccessful.

## Configuration

You need to set up the src/environments/environment.ts file to point at
your development server during development and at your production server in production.

In production, the environments/environment.production.ts file will look like this:

```ts
export const environment = {
  production: true,
  serverPrefix: 'https://statsadmin.tenniscanada.com/tc_stats_server'
};
```

## Deployment

Both client and server are deployed on a Tennis Canada server.
The client is typically built on the deployment server and then placed in the
Websites directory.

You also need to configure Apache to serve the stats client.
On the current deployment that file is at:

```shell
 /c/Apache24/conf/extra/httpd-vhosts.conf
```

That file includes a pointer to the directory of the compiled client,
the ssl configuration and a configuration to tell Apache how to route client
api calls to the stats server.




