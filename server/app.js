var bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	fs = require('fs'),
	csrf = require('csurf')
	express = require('express'),
	expressSession = require('express-session'),
	i18n = require("i18n"),
	mongoose = require('mongoose'),
	logger = require('morgan'),
	flash = require('connect-flash'),
	passport = require('passport'),
	path = require('path'),
	redisStore = require('connect-redis')(expressSession);


/* Setup some globals */
global.config = require('../var/config');
global.models = require('./models')
global.controllers = require('./controllers');
global.root = __dirname;


/* Force JADE and Express to work based on the mode set in our config
 * parameter */
if(global.config) process.env.NODE_ENV = global.config.mode;

var app = express();

if (global.config.mode != 'production') app.use(logger('dev'));

/** Start initializing different middlewares **/
/* International language support */
i18n.configure({
	cookie: 'lang',
	defaultLocale: 'en',
	directory: __dirname + '/locales',
	locales:['en', 'ar', 'in']
});
app.use(i18n.init);


/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/* Setup static path and cache (7 days) */
var cacheTime = 86400000*7;
app.use(express.static(__dirname + '/public', { /*maxAge: cacheTime*/ }));


/* Cookie and sessions */
app.set('trust proxy', 1) // trust first proxy
app.use(cookieParser());
app.use(expressSession({
	// cookie: { secure: true },
	resave: false,
	saveUninitialized: true,
	secret: global.config.sessionSecret,
	store: new redisStore(global.config.redis)
}));
app.use(flash());


/* Setup the CSRF middleware */
csrfMiddleware = csrf({ cookie: true });
app.use(function (request, response, next) {
	/* If the 'X-CSRF-SKIPPER' header is set, then skip CSRF validation. We should
	 * ensure that no one else should get to know about this bypass; Which is
	 * why it is only used in the mobile application for this site. Debate on
	 * this can be carried on, but for time being this will do */
	if(request.headers['x-csrf-skipper']) return next();
	csrfMiddleware(request, response, next);
});


/* Initialize Passport User authentication */
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./controllers/pages/auth/passport/init');
initPassport(passport);


/* Setup the different routes */
app.use('/', require('./routes'));


/* None of the URL matched, so return 404  */
app.use(function(request, response, next) {
    var err = new Error('Not Found');
    err.status = 404;
	next(err);
});


/* Connect to the database */
mongoose.connect('mongodb://' + global.config.mongodb.username +
	':' + global.config.mongodb.password + '@localhost/kuwaitandme');


/* Function to log the error into a file */
var error = fs.createWriteStream('var/error.log', { flags: 'a' });
app.logError = function(err, request) {
	var fullUrl = request.connection.remoteAddress + "@" + request.method + ":"
		+ request.protocol + '://' + request.get('host') + request.originalUrl;
	error.write(fullUrl + "\n");
	error.write(request.headers['user-agent'] + "\n");
	error.write(err.stack + "\n\n");
}


/* helper function to display the 404 page */
var _404 = function(request, response) {
	var fullUrl = request.protocol + '://' + request.get('host')
		+ request.originalUrl;
	response.render('404', { path: fullUrl });
}


/* Setup environment specific functions */
if (global.config.mode == 'production') {
	/* production error handler, no stacktraces leaked to user */
	app.use(function(err, request, response, next) {
		response.status(err.status || 500);

		/* reditect to 404 page if 404 */
		if(err.status == 404) return _404(request, response);

		/* else log error into a file and show error page */
		app.logError(err, request);
		response.render('error', {
			message: err.message,
			error: {}
		});
	});
} else {
	/* prettify the HTML output */
	app.locals.pretty = true;

	/* development error handler will print stacktrace */
	app.use(function(err, request, response, next) {
		response.status(err.status || 500);

		/* reditect to 404 page if 404 */
		if(err.status == 404) return _404(request, response);

		/* else show error page */
		app.logError(err, request);
		response.render('error', {
			message: err.message,
			error: err
		});
	});
}


module.exports = app;