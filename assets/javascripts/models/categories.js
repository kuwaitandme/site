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
		console.log("[model:categories] fetching");
		var that = this;

		$.ajax({
			type: "GET",
			url: app.config.host + "/api/category/",
			dataType: "json",
			async: false,
			beforeSend: ajax.setHeaders,
			success: function(response) {
				console.debug("[model:categories] fetching category details");
				that.set(JSON.parse(response));

				/* Signal any listeners that we are done loading this category */
				that.trigger("ajax:done", that);
			},
			error: function(e) {
				console.error("[model:categories] error fetching category details", e);
			},
		});
	}
});