# config
path      = require 'path'
parentDir = path.join __dirname, '../..'
appDir    = path.join parentDir, 'server'

pkg          = require path.join parentDir, 'package'
assetsDir    = path.join parentDir, 'public'
publicDir    = path.join parentDir, 'public'
templatesDir = path.join assetsDir, 'emails'
viewsDir     = path.join appDir, 'views'
maxAge       = 24 * 60 * 60 * 1000

exports = module.exports = ->
  defaults:
    basicAuth:
      enabled: false
      name: 'admin'
      pass: 'password'
    facebook:
      enabled: false
      clientid: '398935173623108'
      secret: '8a7cb62a5f7bf1d5a444870a82c0cf07'
      scope: [ 'email' ]
    twitter:
      consumerKey: 'dpQcjGDL7Ih8JmETnlZP28bYu'
      consumerSecret: 's1amDz0gIt917RhnkddsDWyTXVZAhjbm7n89rXT7CXE4tKZ10g'
    googlePlus:
      enabled: false
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile'
        'https://www.googleapis.com/auth/userinfo.email'
      ]
      clientId: '384211238362-0iahk91emk4spn58bp53ngk5rn7vb2s0.apps.googleusercontent.com'
      clientSecret: 'wz18RM2bMEeJ9spcjNraIkE2'
    pkg: pkg
    cache: false
    showStack: true
    appDir: appDir
    assetsDir: assetsDir
    publicDir: publicDir
    views:
      dir: viewsDir
      engine: 'jade'

    password:
      minStrength: 0
      limitAttempts: false

    email:
      templates:
        dir: templatesDir
        options: {}
      transport:
        service: 'gmail'
        auth:
          user: 'hi@eskimo.io'
          pass: 'abc123'
      headers: from: 'hi@eskimo.io'

    session:
      secret: 'igloo-change-me'
      key: 'igloo'
      cookie: maxAge: maxAge
      resave: true
      saveUninitialized: true

    trustProxy: true

    updateNotifier:
      enabled: true
      dependencies: {}
      updateCheckInterval: 1000 * 60 * 60
      updateCheckTimeout: 1000 * 20
    staticServer: maxAge: maxAge
    server:
      host: 'localhost'
      cluster: false
      ssl:
        enabled: false
        options: {}
    cookieParser: 'igloo-change-me'
    csrf:
      enabled: false
      options: cookie: maxAge: maxAge
    mongo:
      host: 'localhost'
      port: 27017
      opts: {}
      safe: false
    redis:
      host: 'localhost'
      port: 6379
      maxAge: maxAge
    output:
      handleExceptions: false
      colorize: true
      prettyPrint: false
    logger:
      console: true
      requests: true
      mongo: true
      file: false
      hipchat: false
      slack: false
    jade: amd:
      path: '/js/tmpl/'
      options: {}

  # Testing-specific options
  test:
    url: 'http://localhost:5000'
    server:
      env: 'test'
      port: 5000
    redis: prefix: 'igloo_test'
    logger:
      console: false
      requests: false

  # Development-specific options
  development:
    cache: true
    url: 'http://localhost:3000'
    server:
      env: 'development'
      port: 3000
    mongo:
      dbname: 'kuwaitandme'
      db: 'kuwaitandme'
    redis: prefix: 'igloo-development'

  production:
    cache: true
    url: 'http://localhost:3080'
    password:
      minStrength: 1
      limitAttempts: true
    views: dir: path.join assetsDir, 'dist'
    publicDir:  path.join assetsDir, 'dist'
    showStack: false
    updateNotifier: enabled: false
    server:
      env: 'production'
      port: 3080
      cluster: true
    mongo:
      dbname: 'igloo-production'
      db: 'igloo-production'
    redis: prefix: 'igloo_production'
    output: colorize: false
    logger:
      console: true
      requests: true
      mongo: false
      file: false


exports['@singleton'] = true