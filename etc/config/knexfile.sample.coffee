module.exports =
  development:
    client: "postgres"
    connection:
      database: "databse_development"
      user:     "user"
      password: "password"
    pool:
      min: 2
      max: 10
    migrations: tableName: "migrations"


  staging:
    client: "postgres"
    connection:
      host: "db.sitename.tld"
      database: "databse_testing"
      user:     "user"
      password: "password"
    pool:
      min: 2
      max: 10
    migrations: tableName: "migrations"


  production:
    client: "postgres"
    connection:
      host: "db.sitename.tld"
      database: "databse_production"
      user:     "user"
      password: "password"
    pool:
      min: 2
      max: 10
    migrations: tableName: "migrations"
