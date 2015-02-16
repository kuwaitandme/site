var bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	express = require('express'),
	expressSession = require('express-session'),
	i18n = require("i18n"),
	mongoose = require('mongoose'),
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
app.use(express.static(__dirname + '/public', { maxAge: cacheTime }));


/* Cookie and sessions */
app.use(cookieParser());
app.use(expressSession({
	name: 'sess',
	proxy: true,
	resave: true,
	saveUninitialized: true,
	secret: config.SessionSecret
}));


/* Initialize Passport User authentication */
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./controllers/auth/passport/init');
initPassport(passport);


/* If we are in production mode, redirect all URLs to https */
// if (app.config.mode != 'production') {
// 	app.use(function(req, res, next) {
// 		if (req.protocol === 'http') {
// 			var newUrl = 'https://' + req.get('host') + req.originalUrl;
// 			return res.redirect(newUrl);
// 		}
// 		next();
// 	});
// }


/* Setup the different routes */
app.use('/', routes);


/* None of the URL matched, so return 404  */
app.use(function(req, res, next) {
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	return res.render('404', { path: fullUrl });
});


/* Connect to the database */
mongoose.connect('mongodb://localhost/kuwaitandme');


/* Setup environment specific functions */
if (app.config.mode == 'production') {
	/* production error handler, no stacktraces leaked to user */
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		return res.render('error', {
			message: err.message,
			error: {}
		});
	});
} else {
	app.locals.pretty = true;

	/* development error handler will print stacktrace */
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		return res.render('error', {
			message: err.message,
			error: err
		});
	});
}

module.exports = app;