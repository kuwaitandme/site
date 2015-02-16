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
	 * This function sets up the different variables
	 */
	setup: function() {
		/* Initialize the header. */
		this.header = new this.views.components.header({ el: "header" });

		/* Setup the messages component */
		this.messages = new this.views.components.messages({ el: "#messages" });

		/* Get and initialize the main view */
		var view = window.page;
		var CurrentView = this.views.pages[view];
		if(CurrentView) this.mainbody = new CurrentView({ el: "main" });
	},


	/**
	 * This function starts up the app.
	 */
	start: function() {
		/* Start attaching the module components here, so that other components
		 * can refer to these modules by doing a 'app.modulename', since 'app'
		 * is a global variable */
		this.helpers = require("./helpers/exports");
		this.views = require("./views/exports");

		this.setup();
	}
};

/* Kick start the App. Start back-tracing the app's execution over here, if you
 * are trying to understand my code.
 */
$(document).ready(function() { app.start(); });