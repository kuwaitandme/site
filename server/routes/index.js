var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	controllers = require('../controllers/exports');

/* As with any middleware it is quintessential to call next()
 * if the user is authenticated */
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/auth/login');
}

/* Index URLs */
router.get('/', controllers.landing);
router.get('/privacy', controllers.privacy);
router.get('/terms', controllers.terms);

/* Account URLs */
router.get('/account/manage', isAuthenticated, controllers.landing);

/* Authentication URLs */
router.get('/auth/guest', controllers.auth.guest);
router.get('/auth/login', controllers.auth.login);
router.get('/auth/logout', controllers.auth.logout);
router.get('/auth/signup', controllers.auth.signup);
router.post('/auth/login', passport.authenticate('login', {
	successRedirect: '/account/manage',
	failureRedirect: '/auth/login'
}));
router.post('/auth/signup', passport.authenticate('signup', {
	successRedirect: '/auth/login',
	failureRedirect: '/auth/signup'
}));

/* Classified URLs */
router.get('/classified/edit', isAuthenticated, controllers.landing);
router.get('/classified/post', isAuthenticated, controllers.classified.post);
router.get('/classified/search', controllers.classified.search);
router.get('/classified/single/:id', controllers.classified.single);

module.exports = router;