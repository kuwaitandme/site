var express = require('express'),
	router = express.Router(),
	controllers = require('../controllers/exports');

/* Index URLs */
router.get('/', controllers.landing);
router.get('/privacy', controllers.privacy);
router.get('/terms', controllers.terms);

/* Account URLs */
router.get('/account/manage', controllers.landing);

/* Authentication URLs */
router.get('/auth/guest', controllers.auth.guest);
router.get('/auth/login', controllers.auth.login);
router.get('/auth/logout', controllers.auth.logout);
router.get('/auth/signup', controllers.auth.signup);

/* Classified URLs */
router.get('/classified/edit', controllers.landing);
router.get('/classified/post', controllers.classified.post);
router.get('/classified/search', controllers.classified.search);
router.get('/classified/single/:id', controllers.classified.single);

module.exports = router;