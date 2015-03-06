var controller = module.exports = function() {
	historyIndex: 0,

	controller.prototype.initialize = function() {
		console.log("[controller:router] initializing");

		/* Start HTML5 history */
		this.initializeHTML5history();

		/* Start backbone history (Essential for Backbone routers). */
		Backbone.history.start();
	};


	/**
	 * Initializes the HTML5 history API
	 */
	controller.prototype.initializeHTML5history = function() {
		var that = this;
		if (typeof history.pushState === 'undefined') {
			console.log("[controller:router] HTML 5 History not available. Using fallback mode");
			this.fallback = true;
			return;
		}

		this.historyIndex = 0;
		this.disabled = false;

		/* Trigger our pophistory function on the 'popstate' event */
		onpopstate = function(e) {
			that.popHistory(e);
		};

		/* Modify the current history event to maintain consistency with
	 	 * history pop events */
		var currentState = {
			arguments: { url: document.URL },
			index: this.historyIndex,
			url: document.URL,
			view: window.viewid
		};
		history.replaceState(currentState, "", document.URL);
	};


	/**
	 * Event handler to switch the view in the main page. This event gets
	 * fired on anchor tag with the 'data-view' property set. The 'data-view'
	 * contains the name of the view that we should look for, and the
	 * href will contain the url which should be displayed in the browser.
	 */
	controller.prototype.hrefEventHandler = function(event) {
		if (this.fallback && this.disabled) return;
		event.preventDefault();

		/* Start collecting data */
		var $el = $(event.currentTarget);
		var url = $el[0].href;
		var view = $el.data().view;

		console.groupCollapsed("[controller:router] navigating to page:", view);
		/* Signal the app's view controllers to move to the new view ... */
		this.goto(url, view, null);
		console.groupEnd();
	};


	/**
	 * Commands the app to load the given view, with the given URL.
	 */
	controller.prototype.goto = function(url, view, args) {
		/* Check if we are in fallback mode or not */
		if(this.fallback) return (window.location = url);

		/* Manually append the data for this request into the History API */
		this.pushHistory(url, view, args);

		/* Set the url in the arguments list and send to the view controller */
		args = args || { url: url };
		app.setView(view, args, this.currentState);
	};


	/**
	 * Pushes the given url to the HTML5 history api.
	 */
	controller.prototype.pushHistory = function(url, view, arguments) {
		if (this.fallback && this.disabled) return;

		this.historyIndex += 1;
		this.currentState = {
			arguments: arguments,
			index: this.historyIndex,
			url: url,
			view: view
		};

		console.debug("[controller:router] HTML5 history push", this.currentState);
		history.pushState(this.currentState, this.currentState.view, url);
	};


	/**
	 * Handles the pop history event. Gets the state of the requested page from
	 * the history API and then requests the app to set the view based on that
	 * state.
	 */
	controller.prototype.popHistory = function(e) {
		/* Get the state of this history event. If there isn't any, then
		 * return */
		var currentState = history.state;
		if(!currentState) return;

		/* Check if we are moving forwards or backwards in time */
		if(currentState.index <= this.historyIndex) currentState.reverse = true;
		this.historyIndex = currentState.index;

		console.groupCollapsed("[controller:router] HTML5 popstate");
		console.debug("[controller:router] popstate event:", e);
		console.debug("[controller:router] popstate state:", currentState);

		currentState.arguments = currentState.arguments ||
			{ url: currentState.url };
		app.setView(currentState.view, currentState.arguments, currentState);

		console.groupEnd();
	};


	/**
	 * Reattaches all the view links to use the given event handler. The handler
	 * is only attached to anchor tag with the [data-view] attribute.
	 */
	controller.prototype.reattachRouter = function() {
		var that = this;
		console.log("[controller:router] reattaching href event handlers");
		$("a[data-view]")
			.unbind("click")
			.bind("click", function(event) {
				that.hrefEventHandler(event);
			});
	};
}