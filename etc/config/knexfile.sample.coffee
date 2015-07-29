###
  This file should contain DB credentials for the app. You must fill this up
  accordingly. We recommend using PostgreSQL because of it's recent JSON
  support.

  The app switches from either using the 'development', 'staging' or
  'production' values based on the value set by $NODE_ENV.
###
module.exports =
  development:
    debug: true
    client: "postgres"
    connection:
      database: "kuwaitandme_development"
      user:     "vagrant"
      password: "password"
    pool:
      min: 2
      max: 10
    migrations: tableName: "migrations"


  staging:
    client: "postgres"
    connection:
      host: "db.sitename.tld"
      database: "kuwaitandme_testing"
      user:     "vagrant"
      password: "password"
    pool:
      min: 2
      max: 10
    migrations: tableName: "migrations"


  production:
    client: "postgres"
    connection:
      host: "db.sitename.tld"
      database: "kuwaitandme_production"
      user:     "vagrant"
      password: "password"
    pool:
      min: 2
      max: 10
    migrations: tableName: "migrations"
