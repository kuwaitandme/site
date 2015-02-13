var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var expressSession = require('express-session');
var favicon = require('serve-favicon');
var i18n = require("i18n");
var logger = require('morgan');
var passport = require('passport');
var path = require('path');

var routes = require('./routes/index');
var initPassport = require('./controllers/auth/passport/init');

var app = express();
// app.use(logger('dev'));

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
app.use(bodyParser.urlencoded({ extended: false }));

/* Setup static path and favicon */
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));

/* Cookie and sessions */
app.use(cookieParser());
app.use(expressSession({
	secret: 'e2nURBBjy1ieSbWP',
	name: 'sess',
	proxy: true,
	resave: true,
	saveUninitialized: true
}));

/* Setup the different routes */
app.use('/', routes);

/* Initialize Passport */
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

/* catch 404 and forward to error handler */
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/* Setup environment specific functions */
if (app.get('env') === 'development') {
	app.locals.pretty = true;

	/* development error handler will print stacktrace */
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
} else {
	/* production error handler, no stacktraces leaked to user */
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});
}

module.exports = app;