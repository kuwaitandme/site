var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	controllers = require('../controllers/exports');

/* Helper function to check if the user is authenticated. If not, then
 * redirect to the login page */
var isAuthenticated = function (request, response, next) {
    /* As with any middleware it is quintessential to call next()
     * if the user is authenticated */
	if (request.isAuthenticated()) return next();
	response.redirect('/auth/login');
}

/* Index URLs */
router.get('/', controllers.landing.get);
router.get('/privacy', controllers.privacy.get);
router.get('/terms', controllers.terms.get);

/* Account URLs */
router.get('/account/', isAuthenticated, controllers.account.index.get);
router.get('/account/profile', isAuthenticated, controllers.account.profile.get);
router.get('/account/manage', isAuthenticated, controllers.account.manage.get);

/* Authentication URLs */
router.get('/auth/guest', controllers.auth.guest.get);
router.get('/auth/login', controllers.auth.login.get);
router.get('/auth/logout', controllers.auth.logout.get);
router.get('/auth/signup', controllers.auth.signup.get);
router.post('/auth/login', controllers.auth.login.post);
router.post('/auth/signup', controllers.auth.signup.post);

/* Classified URLs */
router.get('/classified/perk', controllers.classified.perk.get);
router.get('/classified/edit', isAuthenticated, controllers.landing.get);
router.get('/classified/post', controllers.classified.post.get);
router.get('/classified/search', controllers.classified.search.get);
router.get('/classified/single/:id', controllers.classified.single.get);
router.post('/classified/single/:id', controllers.classified.single.get);
router.post('/classified/edit', isAuthenticated, controllers.landing.get);
router.post('/classified/post', isAuthenticated, controllers.classified.post.post);

/* Guest URLs */
router.get('/guest/edit/:hash', controllers.guest.single.get);
router.get('/guest/finish/:hash', controllers.guest.finish.get);
router.get('/guest/post', controllers.guest.post.get);
router.get('/guest/single/:hash', controllers.guest.single.get);
router.post('/guest/edit/:hash', controllers.guest.single.get);
router.post('/guest/post', controllers.guest.post.post);
module.exports = router;