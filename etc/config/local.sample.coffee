# local config (make sure it is ignored by git)
#
# This configuration file is specific to each developer's environment,
# and will merge on top of all other settings from ./config.js
# (but only will merge in development environment)
exports = module.exports = ->
  cache: false
  sitename: "My Awesome site"

  facebook:
    clientid: "1234567890"
    secret: "1234567890"

  twitter:
    consumerKey: "1234567890"
    consumerSecret: "1234567890"

  google:
    clientID: "1234567890"
    clientSecret: "1234567890"

  session:
    secret: "1234567890"

  email:
    noreplyAddress: "noreply@site.com"
    templates: options: webmasterAddress: "webmaster@site.com"
    smtp:
      username: "noreply@site.com"
      password: "123456"
      hostname: "smtp.site.com"
      ssl: true


exports["@singleton"] = true