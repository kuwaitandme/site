bodyParser         = require 'body-parser'
cachemanMemory     = require 'cacheman-memory'
cookieParser       = require 'cookie-parser'
csrf               = require 'csurf'
express            = require 'express'
expressSession     = require 'express-session'
flash              = require 'connect-flash'
fs                 = require 'fs'
logger             = require 'morgan'
mongoose           = require 'mongoose'
passport           = require 'passport'
path               = require 'path'
redis              = require 'redis'
redisStore         = (require 'connect-redis') expressSession


# Setup some globals
global.config      = require '../var/config'
global.models      = require './models'
global.modules     = require './modules'
global.root        = __dirname
global.cache       = new cachemanMemory()


# Force JADE and Express to work based on the mode set in our config parameter
if global.config then process.env.NODE_ENV = global.config.mode


app = express()


# In production or testing env, only log 5XX errors to stdout
if global.config.mode != 'development'
  app.use logger 'combined', skip: (request, response) ->
    response.statusCode < 500
# In development however, log everything except for any assets files
else
  app.use logger 'dev', skip: (request, response) ->
    url = request.url
    rejectedPaths = ['uploads', 'images', 'javascripts', 'stylesheets', 'fonts']
    for path in rejectedPaths
      if (url.indexOf path) != -1 then return true
    false


# view engine setup
app.set 'views', path.join __dirname, 'views'
app.set 'view engine', 'jade'
app.use bodyParser.json()
app.use bodyParser.urlencoded extended: false


# Setup static path and cache (7 days)
cacheTime = 86400000 * 7
app.use  express.static "#{global.root}/../public"


# Cookie and sessions
app.set 'trust proxy', 1
app.use cookieParser()
app.use expressSession
  resave: true
  saveUninitialized: true
  secret: global.config.sessionSecret
  store: new redisStore global.config.redis


# Setup the CSRF middleware
csrfMiddleware = csrf cookie: true
app.use (request, response, next) ->
  # If the 'X-CSRF-SKIPPER' header is set, then skip CSRF validation. We should
  # ensure that no one else should get to know about this bypass; Which is
  # why it is only used in the mobile application for this site. Debate on
  # this can be carried on, but for time being this will do
  if request.headers['x-csrf-skipper'] then return next()
  # csrfMiddleware request, response, next
  next()


initializeModules = global.modules.initialize
initializeModules app


# Error page hander
app.use (err, request, response, next) ->
  # Function to log the server error into a file
  logError = (error, request) ->
    ua = request.headers['user-agent']
    url = "#{request.protocol}://#{request.get 'host'}#{request.originalUrl}"
    fullUrl = "#{ua}@#{request.method}:#{url}"
    message = "#{fullUrl}\n#{error.stack}\n"

    logger = global.modules.logger
    logger request, message, 'error'

  # Set the default error code to 500
  response.status err.status or 500

  # In production, no stack-traces leaked to user
  if global.config.mode == 'production' then error = {}
  else error = err

  # else log error into a file and show error page
  if err.status != 404 then logError err, request
  response.render 'error',
    status: err.status or 500
    message: err.message
    error: error


# Connect to the database
mongoConf = global.config.mongodb
mongoURL = "mongodb://#{mongoConf.username}:#{mongoConf.password}@localhost/#{mongoConf.database}"
mongoose.connect mongoURL


module.exports = app