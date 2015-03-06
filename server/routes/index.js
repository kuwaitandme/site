var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	pages = require('../controllers').pages;

/* Helper function to check if the user is authenticated. If not, then
 * redirect to the login page */
var isAuthenticated = function (request, response, next) {
    /* As with any middleware it is quintessential to call next()
     * if the user is authenticated */
	if (request.isAuthenticated()) return next();
	response.redirect('/auth/login?error=need_login');
}

/* Index URLs */
router.get('/', pages.get);
router.get('/privacy', pages.privacy.get);
router.get('/terms', pages.terms.get);

/* API URLs */
router.get('/api/', pages.api.get);

/* Account URLs */
router.get('/account/', isAuthenticated, pages.account.get);
router.get('/account/manage', isAuthenticated, pages.account.manage.get);
router.get('/account/profile', isAuthenticated, pages.account.profile.get);
router.post('/account/manage', isAuthenticated, pages.account.manage.post);

/* Authentication URLs */
router.get('/auth/activate/:id', pages.auth.activate.get);
router.get('/auth/forgot', pages.auth.forgot.get);
router.get('/auth/guest', pages.auth.guest.get);
router.get('/auth/login', pages.auth.login.get);
router.get('/auth/logout', pages.auth.logout.get);
router.get('/auth/reset/:id', pages.auth.reset.get);
router.get('/auth/signup', pages.auth.signup.get);
router.post('/auth/forgot', pages.auth.forgot.post);
router.post('/auth/login', pages.auth.login.post);
router.post('/auth/reset/:id', pages.auth.reset.post);
router.post('/auth/signup', pages.auth.signup.post);

/* Classified URLs */
router.get('/classified/edit', isAuthenticated, pages.get);
router.get('/classified/finish/:id', pages.classified.finish.get);
router.get('/classified/post', pages.classified.post.get);
router.get('/classified/search', pages.classified.search.get);
router.get('/classified/single/:id', pages.classified.single.get);
router.post('/classified/edit', isAuthenticated, pages.get);
router.post('/classified/finish/:id', pages.classified.finish.post);
router.post('/classified/post', pages.classified.post.post);
router.post('/classified/search', pages.classified.search.post);
router.post('/classified/single/:id', pages.classified.single.post);

/* Guest URLs */
router.get('/guest/edit/:id', pages.guest.single.get);
router.get('/guest/finish/:id', pages.guest.finish.get);
router.get('/guest/post', pages.guest.post.get);
router.get('/guest/single/:id', pages.guest.single.get);
// router.post('/guest/edit/:id', pages.guest.single.get);
router.post('/guest/post', pages.guest.post.post);

module.exports = router;