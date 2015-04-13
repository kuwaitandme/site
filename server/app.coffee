bodyParser         = require 'body-parser'
cachemanMemory     = require 'cacheman-memory'
cookieParser       = require 'cookie-parser'
cronJob            = (require 'cron').CronJob
csrf               = require 'csurf'
express            = require 'express'
expressSession     = require 'express-session'
flash              = require 'connect-flash'
fs                 = require 'fs'
i18n               = require 'i18n'
logger             = require 'morgan'
mongoose           = require 'mongoose'
passport           = require 'passport'
path               = require 'path'
redis              = require 'redis'
redisStore         = (require 'connect-redis') expressSession


# Setup some globals
global.config      = require '../var/config'
global.models      = require './models'
global.helpers     = require './controllers/helpers'
global.controllers = require './controllers'
global.root        = __dirname
global.cache       = new cachemanMemory()


# Force JADE and Express to work based on the mode set in our config parameter
if global.config then process.env.NODE_ENV = global.config.mode
app = express()


# In production or testing env, only log errors to stdout
if global.config.mode != 'development'
  app.use logger 'combined', skip: (req, res) -> res.statusCode < 400
# In development however, log everything except for any assets files
else
  app.use logger 'dev', skip: (req, res) ->
    url = req.url
    rejectedPaths = ['uploads', 'images', 'javascripts', 'stylesheets', 'fonts']
    for path in rejectedPaths
      if (url.indexOf path) != -1 then return true
    false



# International language support
i18n.configure
  cookie: 'l'
  defaultLocale: 'en'
  directory: "#{__dirname}/locales"
  locales: [ 'en', 'ar']
global.__ = i18n.__


# view engine setup
app.set 'views', path.join __dirname, 'views'
app.set 'view engine', 'jade'
app.use bodyParser.json()
app.use bodyParser.urlencoded extended: false


# Setup static path and cache (7 days)
cacheTime = 86400000 * 7
app.use  express.static (__dirname + '/../public')


# Cookie and sessions
app.set 'trust proxy', 1
app.use cookieParser()
app.use expressSession
  resave: true
  saveUninitialized: true
  secret: global.config.sessionSecret
  store: new redisStore global.config.redis

app.use i18n.init

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


# Initialize Passport User authentication
app.use passport.initialize()
app.use passport.session()
initPassport = require './controllers/passport'
initPassport passport


# Setup the different routes
app.use '/', require './routes'


# Connect to the database
mongoose.connect 'mongodb://' + global.config.mongodb.username + ':' +
  global.config.mongodb.password + '@localhost/kuwaitandme'


# Function to log the error into a file
error = fs.createWriteStream 'var/error.log', flags: 'a'

app.logError = (err, request) ->
  addr = request.headers['x-forwarded-for'] || req.connection.remoteAddress;
  date = new Date()
  fullUrl = "#{date}\n
    #{addr}@#{request.method}:
    #{request.protocol}://#{request.get 'host'}#{request.originalUrl}"
  error.write fullUrl + '\n'
  error.write request.headers['user-agent'] + '\n'
  error.write err.stack + '\n\n'

# helper function to display the 404 page
_404 = (request, response) ->
  fullUrl = "#{request.protocol}://#{request.get 'host'}#{request.originalUrl}"
  response.render '404', path: fullUrl


# Setup environment specific functions
if global.config.mode == 'production'

  #production error handler, no stack-traces leaked to user
  app.use (err, request, response, next) ->
    response.status err.status or 500

    # reditect to 404 page if 404
    if err.status == 404 then return _404(request, response)

    # else log error into a file and show error page
    app.logError err, request
    response.render 'error',
      message: err.message
      error: {}

else
  # Prettify the HTML output
  app.locals.pretty = true

  # Development error handler will print stacktrace
  app.use (err, request, response, next) ->
    response.status err.status or 500

    # redirect to 404 page if 404
    if err.status == 404 then return _404(request, response)

    # else show error page
    app.logError err, request
    response.render 'error',
      message: err.message
      error: err

cronInitialize = require './cron'
cronInitialize cronJob

module.exports = app