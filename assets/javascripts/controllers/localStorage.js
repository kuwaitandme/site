/**
 * EXPLAIN CONTROLLER HERE
 *
 * This way, we can avoid having the server returning huge responses which
 * contain HTML code and instead have the server communicate with JSON
 * objects which contain data.
 */
var controller = module.exports = function() {
	/**
	 * Checks the JS version from the server side and setups the local storage
	 * based on it. If the JS version from the local and the server are
	 * different, then reset the local storage. Otherwise have the local storage
	 * cache every page template that it downloads.
	 *
	 * Also, if the browser does not support localStorage use fallback methods.
	 */
	controller.prototype.initialize = function(config) {
		console.log("[controller:localstorage] initializing");

		/* Check for localStorage */
		if(typeof(Storage) !== "undefined") {
			var remoteVersion = window.jsVersion || 0;
			var localVersion = localStorage.getItem("jsVersion");

			/* Check if the versions are different or not */
			if(localVersion != remoteVersion) {
				console.debug("[controller:localstorage] local version", localVersion);
				console.debug("[controller:localstorage] remote version", remoteVersion);
				console.debug("[controller:localstorage] flushing local cache");

				/* If it is, then clear the cache and set the new version */
				localStorage.clear();
				localStorage.setItem("jsVersion", remoteVersion);
			}
		} else {
			/* Setup fallback methods */
			this.fallback = true;
			console.log("[controller:localstorage] HTML5 Storage not supported. Using fallback methods");
			console.warn("[controller:localstorage] no fallback methods for localstorage have been implemented so far");
		}
	};


	/**
	 * Saves the HTML template of the current view in the HTML5 local-storage.
	 * This gets treated as cache and will get loaded the next time the view
	 * has been requested. The HTMLs that gets cached is whatever HTMLs code that
	 * lies inside the current-view, under the '.html-cache' class
	 *
	 * Ideally, we would want to put code that never changes in those tags; eg.
	 * Underscore templates.
	 */
	controller.prototype.cacheCurrentView = function() {
		if(this.fallback) return;

		/* Get the view identifier */
		var view = "page-" + app.views.currentViewName;

		/* Check if this view has been cached or not */
		if(localStorage.getItem(view)) return;

		/* If we reach here, then get the HTML we need to cache and store it */
		console.log("[controller:localstorage] saving current view to cache");
		var html = app.views.currentView.$el.find(".html5-cache").html();

		/* Avoid caching empty html */
		if(!html || html == "") return console.warn("[warn] nothing was cached");

		/* If all went well, save the html */
		localStorage.setItem(view, html);
	};


	/**
	 * This function returns the HTML code (if any) that is cached in the local
	 * storage.
	 *
	 * @param  String   view         The view identifier
	 * @return String                The HTML that was cached.
	 */
	controller.prototype.getCachedViewHTML = function(view) {
		if(this.fallback) return;

		var cache = localStorage.getItem("page-" + view);

		if(cache) console.log("[controller:localstorage] fetched HTML from cache");
		return cache;
	};


	/**
	 * [cache description]
	 *
	 * @param  {[type]} key    [description]
	 * @param  {[type]} object [description]
	 */
	controller.prototype.cache = function(key, object) {
		if(this.fallback) return;

		console.log("[controller:localstorage] setting '" + key +"' into cache");

		var json = JSON.stringify(object);
		localStorage.setItem(key, json);
	};


	/**
	 * [get description]
	 *
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	controller.prototype.get = function(key) {
		if(this.fallback) return;

		console.log("[controller:localstorage] retrieving '" + key +"' from cache");

		var json = localStorage.getItem(key);
		if(json) return JSON.parse(json);
	};
}