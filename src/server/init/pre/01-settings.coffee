compress = require "compression"
http     = require "http"
https    = require "https"


exports = module.exports = (IoC, settings) ->
  app = this

  # Set the environment.
  app.set "env", settings.server.env

  # Set the default views directory.
  app.set "views", settings.views.dir

  # Set the default view engine.
  app.set "view engine", settings.views.engine

  # Make view engine output pretty in development mode.
  if settings.server.env == "development"
    app.locals.pretty = true
    app.set "json spaces", 2

  # Enable caching and compression in production/testing mode.
  else
    app.enable "view cache"
    app.use compress()

  # Finally create the server, with HTTP/HTTPS
  if settings.server.ssl.enabled
    @server = https.createServer settings.server.ssl.options, this
  else @server = http.createServer this

exports["@require"] = [
  "$container"
  "igloo/settings"
]
