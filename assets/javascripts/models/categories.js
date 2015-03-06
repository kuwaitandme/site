var ajax = app.helpers.ajax;

var model = Backbone.Model.extend({
	defaults: {
		_id: null,
		children : [{ _id: null, name: "", count: 0}],
		count: 0,
		name: ""
	}
});

module.exports = Backbone.Collection.extend({
	model:  model,

	initialize: function(config) {
		console.log("[model:categories] initializing");
	},

	fetch: function() {
		console.groupCollapsed("[model:categories] fetching");
		var that = this;
		var localStorage = app.controllers.localStorage;

		/* Attempt to load from HTML5 localStorage */
		var cache = localStorage.get("categories");
		if(cache) {
			console.log("[model:categories] setting categories from cache");
			console.groupEnd();
			return this.parseFetchResponse(cache);
		}

		/* If data wasn't cached, then request it by sending a AJAX request
		 * and then caching the data */
		$.ajax({
			type: "GET",
			url: app.config.host + "/api/category/",
			dataType: "json",
			async: false,
			beforeSend: ajax.setHeaders,
			success: function(response) {
				console.log("[model:categories] fetching category details");
				that.parseFetchResponse(response);

				/* Cache the results */
				console.log("[model:categories] caching category details");
				localStorage.cache("categories", response);

				/* Signal any listeners that we are done loading this category */
				that.trigger("ajax:done", that);
				console.groupEnd();
			},
			error: function(e) {
				console.error("[model:categories] error fetching category details", e);
				console.groupEnd();
			},
		});
	},


	/**
	 * [parseFetchResponse description]
	 *
	 * @param  {[type]} response [description]
	 * @return {[type]}          [description]
	 */
	parseFetchResponse: function(response) {
		this.set(JSON.parse(response.categories));
		this.setCounters(JSON.parse(response.count));
	},


	/**
	 * Appends the counters into each of the category respectively.
	 *
	 * @param  {[type]} counters   [description]
	 */
	setCounters: function(counters) {
		for(var i=0; i<this.length; i++) {
			var parentCat = this.models[i].toJSON();

			for(var j=0; j<parentCat.children.length; j++) {
				var childCat = parentCat.children[j];

				var categoryCount = _.where(counters, {_id: childCat._id})[0];

				if(categoryCount) {
					parentCat.count += categoryCount.total;
					parentCat.children[j].count = categoryCount.total;
				}
			}
			this.models[i].set(parentCat);
		}
	}
});