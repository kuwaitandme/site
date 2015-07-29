# local config (make sure it is ignored by git)
#
# This configuration file is specific to each developer's environment,
# and will merge on top of all other settings from ./config.js
# (but only will merge in development environment)
exports = module.exports = ->
  cache: false
  sitename: "My Awesome site"
  staticUrl: "https://localhost:6902"
  url: "https://localhost:6902"

  facebook:
    enabled: false
    oauth:
      clientid: "XXXXXXXXXXXX"
      secret: "XXXXXXXXXXXX"

  twitter:
    enabled: false
    oauth:
      consumerKey: "XXXXXXXXXXXX"
      consumerSecret: "XXXXXXXXXXXX"
    user: "@twitterhandle"

  google:
    enabled: false
    analyticsCode: "XX-XXXXXXXXXXXX"
    reCaptcha:
      siteKey: "XXXXXXXXXXXX"
      serverKey: "XXXXXXXXXXXX"
    oauth:
      clientID: "XXXXXXXXXXXX"
      clientSecret: "XXXXXXXXXXXX"

  windowslive:
    enabled: false
    oauth:
      clientID: "XXXXXXXXXXXX"
      clientSecret: "XXXXXXXXXXXX"

  wordpress:
    enabled: false
    oauth:
      clientID: "XXXXXXXXXXXX"
      clientSecret: "XXXXXXXXXXXX"

  linkedin:
    enabled: false
    oauth:
      consumerKey: "XXXXXXXXXXXX"
      consumerSecret: "XXXXXXXXXXXX"
      profileFields: [
        "email-address"
        "first-name"
        "id"
        "last-name"
      ]

  amazon:
    enabled: false
    oauth:
      clientID: "XXXXXXXXXXXX"
      clientSecret: "XXXXXXXXXXXX"

  reddit:
    enabled: false
    oauth:
      clientID: "XXXXXXXXXXXX"
      clientSecret: "XXXXXXXXXXXX"

  session: secret: "XXXXXXXXXXXX"

  phonegap: csrfBypassKey: "XXXXXXXXXXXX"

  email:
    enabled: false
    noreplyAddress: "noreply@domain.tld"
    templates: options: webmasterAddress: "webmaster@domain.tld"
    smtp:
      username: "noreply@domain.tld"
      password: "XXXXXXXXXXXX"
      hostname: "smtp.domain.tld"
      ssl: true


exports["@singleton"] = true
