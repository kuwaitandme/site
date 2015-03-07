/*!
 * App entry point for the 'Kuwait & Me' project. This has been such an amazing
 * journey, although sad that I had to do it myself. This app that I have coded
 * below relies heavily on Backbone.js, jQuery and Underscore. Hope it interests
 * you to read through it..
 *
 * This file bootstraps the front-end app. Main JS execution begins here.
 */

window.app = {
	/**
	 * This function starts up the app.
	 */
	start: function() {
		console.group("[app] initializing");

		/* Start attaching the module components here, so that other components
		 * can refer to these modules by doing a 'app.modulename', since 'app'
		 * is a global variable */
		this.config = require("./config");
		this.helpers = require("./helpers");
		this.libs = require("./libs");


		/* Initialize the controllers */
		this.controllers = require("./controllers");
		this.controllers.initialize(this.config);

		/* Initialize the models */
		this.models = require("./models");
		this.models.initialize(this.config);

		/* Initialize the views */
		this.views = require("./views");
		this.views.initialize(this.config);

		console.groupEnd()
	},

	/* Forward function to different app components. This way we can avoid
	 * writing long names for functions that are used often. */
	goto: function(url, view, args) {
		return this.controllers.router.goto(url, view, args);
	},
	reattachRouter: function() {
		return this.controllers.router.reattachRouter()
	},
	setView: function(page, arguments, reverse) {
		return this.views.setView(page, arguments, reverse);
	},
	cacheCurrentView: function() {
		return this.controllers.localStorage.cacheCurrentView();
	},
	getCachedViewHTML: function(view) {
		return this.controllers.localStorage.getCachedViewHTML(view);
	},
	transition: function(options) {
		return this.controllers.pageTransition.transition(options);
	},
	loadResource: function(resource) {
		return this.controllers.resourceLoader.loadResource(resource);
	},
	success: function(text, title) {
		return this.views.messages.success(text, title);
	},
	error: function(text, title) {
		return this.views.messages.error(text, title);
	},
	warn: function(text, title) {
		return this.views.messages.warn(text, title);
	},
};

/* Kick start the App. Start back-tracing the app's execution over here, if you
 * are trying to understand my code.
 */
$(document).ready(function() { app.start(); });