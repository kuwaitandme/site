_                    = require "underscore"
auth                 = require "basic-auth"
bodyParser           = require "body-parser"
jadeAmd              = require "jade-amd"
lessMiddleware       = require "less-middleware"
methodOverride       = require "method-override"
paginate             = require "express-paginate"
path                 = require "path"
responseTime         = require "response-time"
serveFavicon         = require "serve-favicon"
serveStatic          = require "serve-static"
winstonRequestLogger = require "winston-request-logger"


exports = module.exports = (IoC, logger, settings, policies) ->
  app = this

  # ignore GET /favicon.ico
  app.use serveFavicon path.join settings.publicDir, "favicon.ico"

  # # jade-amd templates
  # if settings.server.env == "development"
  #   app.use settings.jade.amd.path, jadeAmd.jadeAmdMiddleware(settings.jade.amd.options)

  # Static server (always keep this first).
  # <http://goo.gl/j2BEl5>
  app.use serveStatic settings.publicDir, settings.staticServer

  # Adds X-Response-Time header.
  app.use responseTime digits: 5

  # Prepare req.log for error handler.
  app.use (req, res, next) ->
    req.log =
      body: req.body
      params: req.params
      path: req.path
      query: req.query
      response_time: (new Date).getTime()
    next()

  # Winston request logger before everything else
  # but only if it was enabled in settings
  if settings.logger.requests
    app.use winstonRequestLogger.create logger,
      "": ":method :statusCode :url[pathname]"
      RT: ":responseTimems"

  # parse request bodies
  # support _method (PUT in forms etc)
  app.use bodyParser.json(), bodyParser.urlencoded(extended: true),
    methodOverride "_method"

  # Pagination
  app.use paginate.middleware 10, 50


exports["@require"] = [
  "$container"
  "igloo/logger"
  "igloo/settings"
  "policies"
]
