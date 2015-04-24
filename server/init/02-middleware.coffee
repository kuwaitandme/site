_                    = require 'underscore'
auth                 = require 'basic-auth'
bodyParser           = require 'body-parser'
jadeAmd              = require 'jade-amd'
lessMiddleware       = require 'less-middleware'
methodOverride       = require 'method-override'
paginate             = require 'express-paginate'
path                 = require 'path'
responseTime         = require 'response-time'
serveFavicon         = require 'serve-favicon'
serveStatic          = require 'serve-static'
winstonRequestLogger = require 'winston-request-logger'


exports = module.exports = (IoC, logger, settings, policies) ->
  app = this

  # ignore GET /favicon.ico
  app.use serveFavicon(path.join(settings.publicDir, 'favicon.ico'))
  if settings.server.env == 'development'
    # less middleware
    # app.use(lessMiddleware(settings.less.path, settings.less.options));
    # jade-amd templates
    app.use settings.jade.amd.path, jadeAmd.jadeAmdMiddleware(settings.jade.amd.options)

  # static server (always keep this first)
  # <http://goo.gl/j2BEl5>
  app.use serveStatic(settings.publicDir, settings.staticServer)
  # add global policy for non api prefixed endpoints
  if settings.basicAuth.enabled
    app.all policies.notApiRouteRegexp, (req, res, next) ->
      creds = auth(req)
      if !creds or creds.name != settings.basicAuth.name or creds.pass != settings.basicAuth.pass
        res.header('WWW-Authenticate', 'Basic realm="Development Environment"').status(401).end()
      next()

  # adds X-Response-Time header
  app.use responseTime digits: 5

  # prepare req.log for error handler
  app.use (req, res, next) ->
    req.log =
      response_time: (new Date).getTime()
      path: req.path
      query: req.query
      body: req.body
      params: req.params
    next()

  # winston request logger before everything else
  # but only if it was enabled in settings
  if settings.logger.requests
    app.use winstonRequestLogger.create(logger)

  # parse request bodies
  # support _method (PUT in forms etc)
  app.use bodyParser.json(), bodyParser.urlencoded(extended: true), methodOverride('_method')

  # pagination
  app.use paginate.middleware(10, 50)


exports['@require'] = [
  '$container'
  'igloo/logger'
  'igloo/settings'
  'policies'
]
