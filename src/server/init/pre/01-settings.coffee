compress = require "compression"
http     = require "http"
https    = require "https"


exports = module.exports = (IoC, settings) ->
  app = this

  # Set the environment.
  app.set "env", settings.server.env

  # Set the default views directory.
  app.set "views", settings.views.dir

  # Set to two spaces for JSON
  app.set "json spaces", 2

  # Set the default view engine.
  app.set "view engine", settings.views.engine

  # Make view engine output pretty in development mode.
  if settings.server.env == "development" then app.locals.pretty = true
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
