bodyParser         = require 'body-parser'
cookieParser       = require 'cookie-parser'
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
redisStore         = (require 'connect-redis') expressSession

# Setup some globals
global.config      = require '../var/config'
global.models      = require './models'
global.helpers     = require './controllers/helpers'
global.controllers = require './controllers'
global.root        = __dirname


# Force JADE and Express to work based on the mode set in our config parameter
if global.config then process.env.NODE_ENV = global.config.mode
app = express()
# if global.config.mode != 'production' then app.use (logger 'dev')



# International language support
i18n.configure
	cookie: 'lang'
	defaultLocale: 'en'
	directory: __dirname + '/locales'
	locales: [ 'en', 'ar', 'in' ]
app.use i18n.init
global.__ = i18n.__

# view engine setup
app.set 'views', (path.join __dirname, 'views')
app.set 'view engine', 'jade'
app.use bodyParser.json()
app.use (bodyParser.urlencoded extended: false)


# Setup static path and cache (7 days)
cacheTime = 86400000 * 7
app.use (express.static __dirname + '/../public')


# Cookie and sessions
app.set 'trust proxy', 1
app.use cookieParser()
app.use (expressSession
	resave: false
	saveUninitialized: true
	secret: global.config.sessionSecret
	store: new redisStore(global.config.redis))


# Setup the CSRF middleware
csrfMiddleware = csrf(cookie: true)
app.use (request, response, next) ->
	# If the 'X-CSRF-SKIPPER' header is set, then skip CSRF validation. We should
	# ensure that no one else should get to know about this bypass; Which is
	# why it is only used in the mobile application for this site. Debate on
	# this can be carried on, but for time being this will do
	if request.headers['x-csrf-skipper'] then return next()
	next()
	# csrfMiddleware request, response, next


# Initialize Passport User authentication
app.use passport.initialize()
app.use passport.session()
initPassport = (require './controllers/passport')
initPassport passport


# Setup the different routes
app.use '/', (require './routes')


# None of the URL matched, so return 404
app.use (request, response, next) ->
	error = new Error 'Not Found'
	error.status = 404
	next error


# Connect to the database
mongoose.connect 'mongodb://' + global.config.mongodb.username + ':' +
	global.config.mongodb.password + '@localhost/kuwaitandme'


# Function to log the error into a file
error = (fs.createWriteStream 'var/error.log', flags: 'a')

app.logError = (err, request) ->
	fullUrl = "#{request.connection.remoteAddress}@#{request.method}:
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

module.exports = app