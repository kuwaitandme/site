# config
path      = require "path"
parentDir = path.join __dirname, "../.."
appDir    = path.join parentDir, "src/server"

pkg          = require path.join parentDir, "package"
assetsDir    = path.join parentDir, "var/public"
publicDir    = path.join parentDir, "var/public"
viewsDir     = path.join appDir, "views"
modelsDir    = path.join parentDir, "etc/db"
templatesDir = path.join viewsDir, "emails"
maxAge       = 24 * 60 * 60 * 1000

knexConfig   = require "./knexfile"

exports = module.exports = ->
  defaults:
    sitename: "SITENAME-GOES-HERE"
    emailAuth:
      enabled: true
      requireActivation: true

    facebook:
      enabled: true
      appID: "XXXXXXXXXX"
      appSecret: "XXXXXXXXXX"
      scope: ["email"]

    twitter:
      enabled: true
      consumerKey: "XXXXXXXXXX"
      consumerSecret: "XXXXXXXXXX"

    google:
      enabled: true
      clientID: "XXXXXXXXXX"
      clientSecret: "XXXXXXXXXX"
      analyticsCode: "UA-XXXXXXXXXX-X"
      scope: [
        "https://www.googleapis.com/auth/userinfo.email"
        "https://www.googleapis.com/auth/userinfo.profile"
      ]

    paypal:
      client_id: "XXXXXXXXXX",
      client_secret: "XXXXXXXXXX"
      enabled: true
      host: "api.sandbox.paypal.com"
      port: ""

    appDir: appDir
    assetsDir: assetsDir
    cache: false
    pkg: pkg
    publicDir: publicDir
    modelsDir: modelsDir
    showStack: true

    reCaptcha:
      enabled: false
      secret: ""
      siteKey: ""

    views:
      dir: viewsDir
      engine: "jade"

    password:
      limitAttempts: false
      minStrength: 0

    email:
      enabled: true
      noreplyAddress: "noreply@server.tld"
      webmasterAddress: "webmaster@server.tld"
      templates:
        dir: templatesDir
        options: {}
      smtp:
        hostname: "mailserver.tld"
        password: "mh76N*&="
        ssl: true
        username: "noreply@server.tld"

    session:
      cookie: maxAge: maxAge
      key: "s"
      resave: true
      saveUninitialized: true
      secret: "change-me"

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

    redis:
      host: "localhost"
      maxAge: maxAge
      port: 6379
    output:
      colorize: true
      handleExceptions: true
      prettyPrint: false
    logger:
      console: true
      file: false
      hipchat: false
      mongo: false
      requests: true
      slack: false
    knex: client: "postgres"
    jade: amd:
      path: "/js/tmpl/"
      options: {}

  # Testing-specific options
  test:
    knex: knexConfig["staging"]
    staticUrl: "http://localhost:5000"
    url: "http://localhost:5000"
    server:
      env: "test"
      port: 5000
    redis: prefix: "kme-testing:"
    logger:
      console: true
      requests: false
    output: level: "debug"

  # Development-specific options
  development:
    cache: true
    knex: knexConfig["development"]
    staticUrl: "http://localhost:3000"
    url: "http://localhost:3000"
    server:
      env: "development"
      port: 3000
    redis: prefix: "kme-development:"
    output: level: "debug"
    paypal: host: "api.sandbox.paypal.com"

  # Production specific options
  production:
    cache: true
    knex: knexConfig["production"]
    staticUrl: "http://localhost:5000"
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
    output:
      handleExceptions: false
      colorize: false
    logger:
      console: true
      file: false
      mongo: false
      requests: true


exports["@singleton"] = true