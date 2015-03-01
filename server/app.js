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

var config = require('../var/config'),
	routes = require('./routes/index');

/* Force JADE and Express to work based on the mode set in our config
 * parameter */
if(config) process.env.NODE_ENV = config.mode;

var app = express();

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
app.use(cookieParser());
app.use(expressSession({
	resave: false,
	saveUninitialized: true,
	secret: config.sessionSecret,
	store: new redisStore(config.redis)
}));
app.use(csrf())
// app.use(function (req, res, next) {
// 	res.cookie('XSRF-TOKEN', req.csrfToken());
// 	res.locals.csrftoken = req.csrfToken();
// 	next();
// })
app.use(flash());


/* Initialize Passport User authentication */
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./controllers/auth/passport/init');
initPassport(passport);


/* Setup the different routes */
app.use('/', routes);


/* None of the URL matched, so return 404  */
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
	next(err);
});


/* Connect to the database */
mongoose.connect('mongodb://' + config.mongodb.username +
	':' + config.mongodb.password + '@localhost/kuwaitandme');


/* Function to log the error into a file */
var error = fs.createWriteStream('var/error.log', { flags: 'a' });
var logError = function(err, request) {
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
if (config.mode == 'production') {
	/* production error handler, no stacktraces leaked to user */
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);

		/* reditect to 404 page if 404 */
		if(err.status == 404) return _404(req, res);

		/* else log error into a file and show error page */
		logError(err, req);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});
} else {
	app.use(logger('dev'));
	app.locals.pretty = true;

	/* development error handler will print stacktrace */
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);

		/* reditect to 404 page if 404 */
		if(err.status == 404) return _404(req, res);

		/* else show error page */
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

module.exports = app;