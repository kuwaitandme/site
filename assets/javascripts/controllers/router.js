var self;

var controller = module.exports = function() {
	controller.prototype.initialize = function() {
		console.log("[init] router");
		self = this;

		/* Start HTML5 history */
		self.initializeHTML5history();

		/* Start backbone history (Essential for Backbone routers). */
		Backbone.history.start();
	};


	/**
	 * Initializes the HTML5 history API
	 */
	controller.prototype.initializeHTML5history = function() {
		if (typeof history.pushState === 'undefined') {
			console.warn("HTML 5 History not available. Using fallback mode");
			self.fallback = true;
			return;
		}

		/* Modify the current history event to maintain consistency with
	 	 * history pop events */
		var currentState = {
			arguments: null,
			view: app.currentPage,
			url: document.URL
		};
		history.replaceState(currentState, "", document.URL);
	};


	/**
	 * Event handler to switch the view in the main page. This event gets
	 * fired on anchor tag with the 'data-view' property set. The 'data-view'
	 * contains the name of the view that we should look for, and the
	 * href will contain the url which should be displayed in the browser.
	 */
	controller.prototype.hrefEventHandler = function(event){
		if (self.fallback) return;
		event.preventDefault();

		/* Start collecting data */
		var $el = $(event.currentTarget);
		var url = $el[0].href;
		var view = $el.data().view;

		/* Signal the app's view controllers to move to the new view ... */
		self.goto(url, view, null);
	};


	/**
	 * Commands the app to load the given view, with the given URL.
	 */
	controller.prototype.goto = function(url, view, args) {
		/* Check if we are in fallback mode or not */
		if(self.fallback) return (window.location = url);

		/* Manually append the data for this request into the History API */
		self.pushHistory(url, view, args);

		/* Set the url in the arguments list and send to the view controller */
		args = args || { url: url };
		app.setView(view, args);
	};


	/**
	 * Pushes the given url to the HTML5 history api.
	 */
	controller.prototype.pushHistory = function(url, view, arguments) {
		var currentState = {
			arguments: arguments,
			view: view,
			url: url
		};

		console.debug("[debug] HTML5 history push", currentState);
		history.pushState(currentState, currentState.view, url);
	};


	/**
	 * Handles the pop history event. Gets the state of the requested page from
	 * the history API and then requests the app to set the view based on that
	 * state.
	 */
	controller.prototype.popHistory = function(e) {
		var currentState = history.state;
		if(!currentState) return;

		console.debug("[debug] HTML5 history pop", currentState);
		app.setView(currentState.view, currentState.arguments);
	};


	/**
	 * Reattaches all the view links to use the given event handler. The handler
	 * is only attached to anchor tag with the [data-view] attribute.
	 */
	controller.prototype.reattachRouter = function() {
		$("a[data-view]")
			.unbind("click", function(event) {
				self.hrefEventHandler(event);
			})
			.bind("click", function(event) {
				self.hrefEventHandler(event);
			});
	};
}