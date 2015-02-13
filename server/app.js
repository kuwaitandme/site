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

var app = express();

i18n.configure({
	cookie: 'lang',
	defaultLocale: 'en',
	directory: __dirname + '/locales',
	locales:['en', 'ar', 'in']
});

/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'mySecretKey'}));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(i18n.init);
app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());

/* Setup the different routes */
app.use('/', routes);

/* Initialize Passport Strategies */
var initPassport = require('./controllers/auth/passport/init');
initPassport(passport);

/* catch 404 and forward to error handler */
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});


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