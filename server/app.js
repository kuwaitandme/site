var bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	express = require('express'),
	expressSession = require('express-session'),
	i18n = require("i18n"),
	mongoose = require('mongoose'),
	multer  = require('multer'),
	passport = require('passport'),
	path = require('path');

var config = require('./config'),
	routes = require('./routes/index');

if(config) process.env.NODE_ENV = config.mode;

var app = express();

/* Setup settings from the configuration file */
if(config) app.config = config;
else app.config = {
	port: 3000,
	hostname: "localhost",
}

/* International langauge support */
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
// app.use(express.bodyParser({uploadDir:'./uploads'}));
// app.use(bodyParser.urlencoded({ extended: false }));

/* to support JSON/URL-encoded bodies */
// app.use(express.json());
// app.use(express.urlencoded());

/* Setup static path and favicon */
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(__dirname + '/public/favicon.ico'));

/* Cookie and sessions */
app.use(cookieParser());
app.use(expressSession({
	name: 'sess',
	proxy: true,
	resave: true,
	saveUninitialized: true,
	secret: 'e2nURBBjy1ieSbWP'
}));

/* Initialize Passport */
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./controllers/auth/passport/init');
initPassport(passport);

/* Setup the different routes */
app.use('/', routes);

/* catch 404  */
app.use(function(req, res, next) {
	return res.render('error', {
		message: "404"
	});
});

/* Connect to the database */
mongoose.connect('mongodb://localhost/kuwaitandme');

/* Setup environment specific functions */
if (app.config.mode == 'development') {
	app.locals.pretty = true;

	/* development error handler will print stacktrace */
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		return res.render('error', {
			message: err.message,
			error: err
		});
	});
} else {
	/* production error handler, no stacktraces leaked to user */
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		return res.render('error', {
			message: err.message,
			error: {}
		});
	});
}

module.exports = app;