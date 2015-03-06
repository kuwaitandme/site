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
		console.group("[view] initializing");

		/* Cache some DOM variables */
		this.$body = $("body");
		this.$ptMain = $("#pt-main");
		this.$currentPage = $("#current-page");
		this.$nextPage = $("#next-page");
		this.$previousPage = $("#prev-page");
		this.previousView = this.nextView = null;

		/* Index all the views first */
		this.views = pages;

		/* Render different components */
		this.header = new components.header({ el: "header" });
		this.messages = new components.messages({ el: "#messages" });

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
	getView: function(name) { return pages[name]; },


	/**
	 * Set's the currentView with all the proper animations and DOM
	 * manipulations.
	 *
	 * @param  String   view         A string containing the identifier of the
	 *                               view that we must switch to.
	 * @param  Object   arguments    An object containing properties that gets
	 *                               passed on to the new view.
	 * @param  Object   HistoryState An object that contains details about the
	 *                               history event in context.
	 */
	setView: function(view, arguments, HistoryState) {
		console.debug("[view] setting view to '" + view +
			"' with history:", HistoryState);
		var that = this;
		HistoryState = HistoryState || {};

		var reverse = HistoryState.reverse || false;
		var historyIndex = HistoryState.index || 0;

		/* Get the view */
		this.currentViewName = view;
		var currentView = this.getView(view);

		/* Check if there was a view before */
		if(this.currentView) {
			/* Clean up the view before switching to the next one. Detach
			 * all event handlers and signal the view to run any 'closing'
			 * animations. */
			this.currentView.undelegateEvents();
			if(this.currentView.onLeave) this.currentView.onLeave();

			console.log("[view] creating buffer page to hold new view");

			/* Create the target page (next or previous), based on the 'reverse'
			 * option. Here we make use of our two helper functions to properly
			 * create the page while deleting any old ones and reusing recent
			 * ones. */
			var $targetPage, viewExists;
			if(!reverse) viewExists = this.createNextPage(historyIndex);
			else viewExists = this.createPreviousPage(historyIndex);

			/* Find the target page. Which is the last child */
			$targetPage = this.$ptMain.find(".pt-page:last-child");

			if(!viewExists) {
				/* Get and set the HTML for the target page */
				var html = this.fetchHTML(view, arguments.url);
				$targetPage.html(html);
				$targetPage.addClass(view);

				/* Initialize the view for this page */
				this.currentView = new currentView({
					arguments: arguments,
					el: $targetPage
				});
			} else {

				this.currentView = this.targetView;
			}

			/* Signal the app to transition to the new page */
			app.transition({
				$targetPage: $targetPage,
				reverse: reverse
			});

		} else {
			console.log("[view] initializing first view");

			/* Else load set the currentView directly without any transition
			 * animations */
			this.currentView = new currentView({
				arguments: arguments,
				el: ".pt-page-current"
			});

		}

		/* Signal the header to update itself */
		this.header.update();

		/* Attempt to cache the HTML */
		app.cacheCurrentView();

		/* Now render signal the view to manipulate the DOM. */
		if(!viewExists) this.currentView.render();
		else this.currentView.$el.scrollTop(this.currentView.scrollPosition);

		/* Reattach the event handlers for the router */
		app.reattachRouter();

		/* Recall google Analytics */
		this.googleAnalyticsSend();

		if(that.currentView.postAnimation) that.currentView.postAnimation();

	},


	/**
	 * [createNextPage description]
	 * @return {[type]} [description]
	 */
	createNextPage: function(historyIndex) {
		var that = this;
		var $el = $("<div></div>")
			.addClass('pt-page')
			.data('index', historyIndex);

		this.previousView = this.currentView;
		this.previousView.scrollPosition = this.currentView.$el.scrollTop();

		$(".pt-page").each(function() {
			var $page = $(this);
			var index = $page.data('index') || 0;
			if(index != historyIndex - 1) $page.remove();
		});
		this.$ptMain.append($el);

		return false;
	},


	/**
	 * [createNextPage description]
	 * @return Boolean    True iff there was a view already initialized in the
	 *                    previous page.
	 */
	createPreviousPage: function(historyIndex) {
		var that = this;
		var viewExists = false;
		var $el = $("<div></div>")
			.addClass('pt-page')
			.data('index', historyIndex);

		this.nextView = this.currentView;
		this.nextView.scrollPosition = this.currentView.$el.scrollTop();

		$(".pt-page").each(function() {
			var $page = $(this);
			var index = $page.data('index') || 0;
			if(index != historyIndex + 1) {
				if(index != historyIndex) return $page.remove();

				$el = $page;
				that.targetView = that.nextView;
				viewExists = true;
			}
		});
		this.$ptMain.append($el);

		return viewExists;
	},


	/**
	 * Fetches the HTML for the given view and returns it. This function first
	 * checks the local-storage if the view's HTML has been cached or not.
	 * If the view has been cached, then it loads the HTML from it and returns.
	 * If the view wasn't cached, then the function loads the HTML via a AJAX
	 * request.
	 *
	 * @param  String view     The view identifier
	 * @return String          The HTML code that was fetched
	 */
	fetchHTML: function(view, url) {
		console.log("[view] trying to find HTML in cache for view", view);
		var html = app.getCachedViewHTML(view);
		if(html) {
			console.log("[view] HTML found from cache!");
			return html;
		}

		console.debug("[view] no HTML in cache, fetching HTML via AJAX", url);
		$.ajax({
			type: "GET",
			url: url,
			async: false,
			success: function(response) {
				html = $(response).find(".pt-page").html();
			}, error: function(e) {
				console.error("[view] error sending GET request", e);
			},
		});
		return html;
	},


	/**
	 * Function to safely call the Google analytics script
	 */
	googleAnalyticsSend: function() {
		if(typeof ga !== 'undefined') ga('send', 'pageview');
	}
}