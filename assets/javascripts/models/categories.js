var ajax = require("app-helpers").ajax;
var localStorage = require("app-controllers").localStorage;

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
		console.group("[model:categories] fetching");
		var that = this;
		// var localStorage = app.controllers.localStorage;

		/* Attempt to load from HTML5 localStorage */
		var cache = localStorage.get("categories");
		if(cache) {
			console.log("[model:categories] setting categories from cache");
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
			},
			error: function(e) {
				console.error("[model:categories] error fetching category details", e);
				console.groupEnd();
			},
		});
	},


	/**
	 * This function parses the response and saves it into the collection
	 * properly.
	 *
	 * @param  Object response   The response from the server API or from the
	 *                           cache.
	 */
	parseFetchResponse: function(response) {
		this.set(JSON.parse(response.categories));
		this.setCounters(JSON.parse(response.count));
		console.groupEnd();
	},


	/**
	 * Appends the counters into each of the category respectively.
	 *
	 * @param  Array  counters     An array contain category-counter pairs.
	 */
	setCounters: function(counters) {
		console.log("[model:categories] setting counters to categories");
		for(var i=0; i<this.length; i++) {
			var category = this.models[i].toJSON();

			for(var j=0; j<category.children.length; j++) {
				var childCat = category.children[j];

				/* Find the category in the counters array */
				var categoryCount = _.where(counters, {_id: childCat._id})[0];

				/* Append the counters properly if needed */
				if(categoryCount) {
					category.count += categoryCount.total;
					category.children[j].count = categoryCount.total;
				}
			}

			this.models[i].set(category);
		}
	},


	/**
	 * Finds a category, given it's id.
	 *
	 * @param   String   id    The id of the classified to be found
	 */
	find: function (id) {
		var categories = this.toJSON();

		for(var i=0; i<categories.length; i++) {
			var category = categories[i];

			for(var j=0; j<category.children.length; j++) {
				var child = category.children[j];

				if(child._id == id) return {
					child: child.name,
					parent: category.name
				};
			}
		}
	},
});