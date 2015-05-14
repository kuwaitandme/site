# config
path      = require "path"
parentDir = path.join __dirname, "../.."
appDir    = path.join parentDir, "server"

pkg          = require path.join parentDir, "package"
assetsDir    = path.join parentDir, "public"
publicDir    = path.join parentDir, "public"
viewsDir     = path.join appDir, "views"
templatesDir = path.join viewsDir, "emails"
maxAge       = 24 * 60 * 60 * 1000

knexConfig   = require "./knexfile"

exports = module.exports = ->
  defaults:
    sitename: "SITE-NAME-GOES-HERE"
    emailAuth:
      enabled: true
      requireActivation: true
    facebook:
      enabled: false
      clientid: "XXXXXXXXXX"
      secret: "XXXXXXXXXX"
      scope: ["email"]
    twitter:
      enabled: false
      consumerKey: "XXXXXXXXXX"
      consumerSecret: "XXXXXXXXXX"
    google:
      enabled: true
      scope: [
        "https://www.googleapis.com/auth/userinfo.email"
        "https://www.googleapis.com/auth/userinfo.profile"
      ]
      clientID: "XXXXXXXXXX"
      clientSecret: "XXXXXXXXXX"
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
      noreplyAddress: "noreply@server.tld"
      enabled: true
      templates:
        dir: templatesDir
        options:
          webmasterAddress: "webmaster@server.tld"
      smtp:
        username: "noreply@server.tld"
        password: "mh76N*&="
        hostname: "mailserver.tld"
        ssl: true

    session:
      secret: "change-me"
      key: "s"
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
      db: "testing"
      dbname: "testing"
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
    knex: client: "postgres"
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
    url: "http://localhost:3000"
    server:
      env: "development"
      port: 3000
    redis: prefix: "kme-development:"

  # Production specific options
  production:
    knex: knexConfig["production"]
    cache: true
    url: "http://localhost:3080"
    password:
      minStrength: 1
      limitAttempts: true
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
      file: false
      mongo: false
      requests: true


exports["@singleton"] = true