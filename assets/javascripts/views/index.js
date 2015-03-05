var components = require("./components"),
	pages = require("./pages");

/**
 * EXPLAIN THIS MODULE
 *
 * @type {Object}
 */
module.exports = {
	/**
	 * Setup the different views. ie. Initialize the different controllers for
	 * the header, currentView and other components.
	 */
	initialize: function() {
		console.group("initialize views");

		this.$body = $("body");
		this.$currentPage = $("#current-page");
		this.$nextPage = $("#next-page");
		this.$previousPage = $("#prev-page");

		/* Index all the views first */
		this.views = pages;

		/* Render the header */
		this.header = new components.header({ el: "header" });

		/* Get and initialize the main view */
		var view = window.viewid;
		this.setView(view, {url: document.URL});

		console.groupEnd();
	},


	/**
	 * Finds the view with the given name and returns it's object.
	 *
	 * @param  String          name  The name of the view to be found.
	 * @return Backbone.View         The Backbone.View object of the view found.
	 */
	getView: function(name) {
		return this.views[name];
	},


	/**
	 * Set's the currentView with all the proper animations and DOM
	 * manipulations.
	 *
	 * @param  String   view         A string containing the identifier of the
	 *                               view that we must switch to.
	 * @param  Object   arguments    An object containing properties that gets
	 *                               passed on to the new view.
	 */
	setView: function(view, arguments) {
		console.debug("[debug] setting view to '" + view +
			"' with arguments:", arguments);

		/* Get the view first */
		this.currentViewName = view;
		var currentView = this.getView(view);

		/* Check if there was a view before */
		if(this.currentView) {
			/* Clean up the view before switching to the next one. Detach
			 * all event handlers and signal the view to run any 'closing'
			 * animations.
			 */
			this.currentView.undelegateEvents();
			if(this.currentView.onLeave) this.currentView.onLeave();

			var $nextPage = this.createNextPage();
			var html = this.fetchHTML(view, arguments.url);
			console.log(html);
			$nextPage.html(html);
			$nextPage.attr('id', view);

			this.currentView = new currentView({
				arguments: arguments,
				$el: $nextPage
			});

			window.nextPage();
		} else {
			console.debug("[debug] no view saved before. Initializing first view");
			/* Else load set the currentView directly without any transition
			 * animations */
			this.currentView = new currentView({
				arguments: arguments,
				el: ".pt-page-current"
			});
		}

		/* Attempt to cache the HTML */
		app.cacheCurrentView();

		/* Now render the page and attach the events to it*/
		this.currentView.render();
		this.currentView.delegateEvents();

		/* Signal the view to run any 'starting' animations */
		if(this.currentView.onEnter) this.currentView.onEnter();

		/* Give the body the right id, so that we can apply the right CSS
		 * styles */
		this.$body.attr("id", this.currentViewName);

		/* Reattach the event handlers for the router */
		app.reattachRouter();

		/* Recall google Analytics */
		this.googleAnalyticsSend();
	},

	createNextPage: function() {
		var $el = $("<div class='pt-page'></div>");
		$("#pt-main").append($el);
		return $el;
	},


	/**
	 * Fetches the HTML for the given view and returns it. This function first
	 * checks the local-storage if the view's HTML has been cached or not.
	 * If the view has been cached, then it loads the HTML from it and returns.
	 * If the view wasn't cached, then the function loads the HTML via a AJAX
	 * request.
	 *
	 * @param  {[type]} view [description]
	 * @return {[type]}      [description]
	 */
	fetchHTML: function(view, url) {
		console.log(url);
		var html = app.getCachedViewHTML(view);
		if(html) return html;

		$.ajax({
			type: "GET",
			url: url,
			async: false,
			success: function(response) {
				html = $(response).find("#current-page").html();
				console.debug("Fetching HTML", url, html);
			}, error: function(e) {
				console.error("Error sending GET request", e);
			},
		});
		return html;
	},

	animateNextPage: function() {
		console.debug("[debug] animating next page");
		var $curpage = this.$currentPage;
		var $nextpage = this.$nextPage;

		window.nextPage();
		// this.$currentPage.hide();
		// this.$nextPage.show();

		this.$currentPage.attr("id", "prev-page");
		this.$nextPage.attr("id", "current-page");
		this.$previousPage.attr("id", "next-page");

		this.$currentPage = this.$nextPage;
		this.$nextPage = this.$previousPage;
		this.$previousPage = $curpage;

		this.$nextPage.html("");
	},

	/**
	 * Function to safely call the Google analytics script
	 */
	googleAnalyticsSend: function() {
		if(typeof ga !== 'undefined') ga('send', 'pageview');
	}
}