# local config (make sure it is ignored by git)
#
# This configuration file is specific to each developer's environment,
# and will merge on top of all other settings from ./config.js
# (but only will merge in development environment)
exports = module.exports = ->
  cache: false
  sitename: "My Awesome site"
  staticUrl: "https://localhost:3000"
  url: "https://localhost:3000"

  facebook: oauth:
    clientid: "XXXXXXXXXXXX"
    secret: "XXXXXXXXXXXX"

  twitter:
    oauth:
      consumerKey: "XXXXXXXXXXXX"
      consumerSecret: "XXXXXXXXXXXX"
    user: "@twitterhandle"

  google:
    analyticsCode: "XX-XXXXXXXXXXXX"
    reCaptcha:
      siteKey: "XXXXXXXXXXXX"
      serverKey: "XXXXXXXXXXXX"
    oauth:
      clientID: "XXXXXXXXXXXX"
      clientSecret: "XXXXXXXXXXXX"

  windowslive: oauth:
    clientID: "XXXXXXXXXXXX"
    clientSecret: "XXXXXXXXXXXX"

  wordpress: oauth:
    clientID: "XXXXXXXXXXXX"
    clientSecret: "XXXXXXXXXXXX"

  linkedin: oauth:
    consumerKey: "XXXXXXXXXXXX"
    consumerSecret: "XXXXXXXXXXXX"
    profileFields: [
      "email-address"
      "first-name"
      "id"
      "last-name"
    ]


  windowslive: oauth:
    clientID: "XXXXXXXXXXXX"
    clientSecret: "XXXXXXXXXXXX"

  wordpress: oauth:
    clientID: "XXXXXXXXXXXX"
    clientSecret: "XXXXXXXXXXXX"

  linkedin: oauth:
    consumerKey: "XXXXXXXXXXXX"
    consumerSecret: "XXXXXXXXXXXX"
    profileFields: [
      "email-address"
      "first-name"
      "id"
      "last-name"
    ]

  amazon: oauth:
    clientID: "XXXXXXXXXXXX"
    clientSecret: "XXXXXXXXXXXX"

  reddit: oauth:
    clientID: "XXXXXXXXXXXX"
    clientSecret: "XXXXXXXXXXXX"

  session: secret: "XXXXXXXXXXXX"

  phonegap: csrfBypassKey: "XXXXXXXXXXXX"

  email:
    noreplyAddress: "noreply@domain.tld"
    templates: options: webmasterAddress: "webmaster@domain.tld"
    smtp:
      username: "noreply@domain.tld"
      password: "XXXXXXXXXXXX"
      hostname: "smtp.domain.tld"
      ssl: true


exports["@singleton"] = true
