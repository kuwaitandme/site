compress = require "compression"
http     = require "http"
https    = require "https"


exports = module.exports = (IoC, settings) ->
  app = this

  # set the environment
  app.set "env", settings.server.env

  # set the default views directory
  app.set "views", settings.views.dir

  # set to two spaces for JSON
  app.set "json spaces", 2

  # set the default view engine
  app.set "view engine", settings.views.engine

  if settings.server.env == "development"
    # make view engine output pretty
    app.locals.pretty = true

  if settings.server.env == "production"
    # enable view caching
    app.enable "view cache"
    # compress response data with gzip/deflate
    # this overwrites res.write and res.end functions
    app.use compress()
    # jade-amd templates
    # TODO: use my gulp jade/requirejs task
  if settings.server.ssl.enabled
    @server = https.createServer settings.server.ssl.options, this
  else @server = http.createServer this

exports["@require"] = [
  "$container"
  "igloo/settings"
]
