# config
path      = require "path"
parentDir = path.join __dirname, "../.."
appDir    = path.join parentDir, "server"

pkg          = require path.join parentDir, "package"
assetsDir    = path.join parentDir, "public"
publicDir    = path.join parentDir, "public"
templatesDir = path.join assetsDir, "emails"
viewsDir     = path.join appDir, "views"
maxAge       = 24 * 60 * 60 * 1000

knexConfig   = require "./knexfile"

exports = module.exports = ->
  defaults:
    emailAuth:
      enabled: true
      requireActivation: true
    facebook:
      enabled: false
      clientid: "398935173623108"
      secret: "8a7cb62a5f7bf1d5a444870a82c0cf07"
      scope: [ "email" ]
    twitter:
      enabled: false
      consumerKey: "dpQcjGDL7Ih8JmETnlZP28bYu"
      consumerSecret: "s1amDz0gIt917RhnkddsDWyTXVZAhjbm7n89rXT7CXE4tKZ10g"
    google:
      enabled: true
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile"
        "https://www.googleapis.com/auth/userinfo.email"
      ]
      clientID: "384211238362-0iahk91emk4spn58bp53ngk5rn7vb2s0.apps.googleusercontent.com"
      clientSecret: "wz18RM2bMEeJ9spcjNraIkE2"
    pkg: pkg
    cache: false
    showStack: true
    appDir: appDir
    assetsDir: assetsDir
    publicDir: publicDir

    reCaptcha:
      enabled: false
      secret: ""
      siteKey: ""

    views:
      dir: viewsDir
      engine: "jade"

    password:
      minStrength: 0
      limitAttempts: false

    email:
      templates:
        dir: templatesDir
        options: {}
      transport:
        service: "gmail"
        auth:
          user: "hi@eskimo.io"
          pass: "abc123"
      headers: from: "hi@eskimo.io"

    session:
      secret: "kme-change-me"
      key: "kme"
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
      host: "localhost"
      cluster: false
      ssl:
        enabled: false
        options: {}
    cookieParser: "kme-change-me"
    csrf:
      enabled: false
      options: cookie: maxAge: maxAge
    mongo:
      host: "localhost"
      port: 27017
      opts: {}
      safe: false
    redis:
      host: "localhost"
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
    knex:
      client: "postgres"
    jade: amd:
      path: "/js/tmpl/"
      options: {}

  # Testing-specific options
  test:
    knex: knexConfig["staging"]
    url: "http://localhost:5000"
    server:
      env: "test"
      port: 5000
    redis: prefix: "kme-testing:"
    logger:
      console: false
      requests: false

  # Development-specific options
  development:
    knex: knexConfig["development"]
    cache: true
    url: "http://development.kuwaitandme.com"
    server:
      env: "development"
      port: 3000
    mongo:
      dbname: "kuwaitandme"
      db: "kuwaitandme"
    redis: prefix: "kme-development:"

  production:
    knex: knexConfig["production"]
    cache: true
    url: "http://localhost:3080"
    password:
      minStrength: 1
      limitAttempts: true
    views: dir: path.join assetsDir, "dist"
    publicDir:  path.join assetsDir, "dist"
    showStack: false
    updateNotifier: enabled: false
    server:
      env: "production"
      port: 3080
      cluster: true
    redis: prefix: "kme:"
    output: colorize: false
    logger:
      console: true
      requests: true
      mongo: false
      file: false


exports["@singleton"] = true