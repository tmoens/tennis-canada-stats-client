read the README.md

## git repo

now on gitHub

https://github.com/tmoens/tennis-canada-stats-client

Running the tc_stats_server ==> done in task scheduler out of the directory in which it was built.
By default, it will run on port 3003, but you can configure it to run on any port in the
production.env file. For example:
PORT=3003

Configuring apache => make sure you proxy requests to the tc_stats_server to the port on which the
server is running.  

## Production Build

ng build --configuration=production

Deployment
To deploy the production build locally, copy the content of TCStatsAdminClient directory to
path/to/your/server/docroot

TO deploy it on the server - on the server: git clone, then build and deploy on the server.

Generally
1) deploy it locally and test it out
2) deploy to staging on TC server and test it out
3) deploy to production and test it out

