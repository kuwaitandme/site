# Update with your config settings.

module.exports =

  development:
    client: 'postgres'
    connection:
      database: 'kuwaitandme'
      user:     'kuwaitandme'
      password: 'kuwaitandme'
    pool:
      min: 2
      max: 10
    migrations:
      tableName: 'migrations'


  staging:
    client: 'postgres'
    connection:
      database: 'kuwaitandme'
      user:     'kuwaitandme'
      password: 'kuwaitandme'
    pool:
      min: 2
      max: 10
    migrations:
      tableName: 'migrations'

  production:
    client: 'postgres'
    connection:
      database: 'kuwaitandme'
      user:     'kuwaitandme'
      password: 'kuwaitandme'
    pool:
      min: 2
      max: 10
    migrations:
      tableName: 'migrations'