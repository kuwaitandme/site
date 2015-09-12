path      = require "path"

# Setup the different directory variables
parentDir    = path.join __dirname, "../.."
appDir       = path.join parentDir, "core/server"
assetsDir    = path.join parentDir, "content"
publicDir    = path.join parentDir, "content"
backupDir    = path.join parentDir, "var/backups"
viewsDir     = path.join appDir,    "views"
modelsDir    = path.join parentDir, "etc/db"
templatesDir = path.join viewsDir,  "emails"

# Other constants
pkg          = require path.join parentDir, "package"
maxAge       = 24 * 60 * 60 * 1000
knexConfig   = require "./knexfile"


exports = module.exports = ->
  defaults:
    sitename: "Kuwait & Me"

    emailAuth:
      enabled: true
      requireActivation: true

    facebook:
      enabled: true
      supportMeta: true
      scope: ["email"]

    twitter:
      enabled: false
      supportMeta: true
      user: "@kuwaitandme"

    reCaptcha:
      siteKey: "XXXXXXXXXX"
      siteSecret: "XXXXXXXXXX"
    google:
      enabled: true
      analyticsCode: "UA-XXXXXXXXXX-X"
      scope: [
        "https://www.googleapis.com/auth/userinfo.email"
        "https://www.googleapis.com/auth/userinfo.profile"
      ]

    windowslive: scope: ["wl.basic", "wl.emails"]

    linkedin:
      csope: [
        "r_basicprofile"
        "r_emailaddress"
      ]

    amazon: scope: ["profile"]

    paypal:
      client_id: "XXXXXXXXXX",
      client_secret: "XXXXXXXXXX"
      enabled: true
      host: "api.sandbox.paypal.com"
      port: ""
      currency: "USD"


    appDir: appDir
    assetsDir: assetsDir
    backupDir: backupDir
    cache: false
    modelsDir: modelsDir
    pkg: pkg
    publicDir: publicDir
    showStack: true


    views:
      dir: viewsDir
      engine: "jade"

    password:
      limitAttempts: false
      minStrength: 0

    email:
      enabled: false
      noreplyAddress: "noreply@kuwaitandme.com"
      webmasterAddress: "webmaster@kuwaitandme.com"
      templates:
        dir: templatesDir
        options: {}
      smtp:
        hostname: "mailserver.tld"
        password: "XXXXXX"
        ssl: true
        username: "noreply@server.tld"

    session:
      cookie: maxAge: maxAge
      key: "s"
      resave: true
      saveUninitialized: false
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
      enabled: true
      options: cookie:
        key: "XSRF-TOKEN"
        maxAge: maxAge

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