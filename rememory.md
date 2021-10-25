read the README.md

## git repo

now on github

https://github.com/tmoens/tennis-canada-stats-client

## Bad Design


The ill-advised plan was to deploy this under rogersrankings.com/TCStatsClient
rather than as a separate site. This was sheer ignorance when the work started and it
kinda worked, regardless of how goofy it was in retrospect.

This introduced the following problems:
1. There is no apache configuration for this "site"

Running the tc_stats_server ==> done in task scheduler out of the directory in which it was built.
By default it will run on port 3002, but you can configure it to run on any port in the
production.env file. For example:
PORT=3003

Configuring apache => make sure you proxy requests to the tc_stats_server to the port on which the
server is running.  
This ought to have been done in a vhost config file, but it is done in the main apache config file.

## Production Build

ng build --base-href=/TCStatsAdminClient/ --configuration=production
Note: when building on the production server in git-bash, it builds the base href
wrong in the dist/index file - so you need to manually fix it.
OR if using git-bash - this seems to work...
ng build --base-href="//TCStatsAdminClient\\" --configuration=production

which will create a directory called TCStatsAdminClient

Deployment
To deploy the production build locally, copy the TCStatsAdminClient directory to
path/to/your/server/TCStatsAdminClient. For a local xampp deployment,
put the TCStatsAdminClient in the htdocs directory under xampp.

TO deploy it on the server - on the server: git clone, then build and deploy on the server.

Generally
1) deploy it locally and test it out
2) deploy to staging on TC server and test it out
3) deploy to production and test it out
~
4) 

