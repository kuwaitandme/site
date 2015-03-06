var ajax = app.helpers.ajax;

var model = Backbone.Model.extend({
	defaults: {
		_id: null,
		name: ""
	}
});

module.exports = Backbone.Collection.extend({
	model:  model,

	initialize: function(config) {
		console.log("[model:locations] initializing");
	},

	fetch: function() {
		console.log("[model:locations] fetching");
		var that = this;

		$.ajax({
			type: "GET",
			url: app.config.host + "/api/location/",
			dataType: "json",
			async: false,
			beforeSend: ajax.setHeaders,
			success: function(response) {
				console.debug("[model:locations] fetching category details");
				that.set(JSON.parse(response));

				/* Signal any listeners that we are done loading this category */
				that.trigger("ajax:done", that);
			},
			error: function(e) {
				console.error("[model:locations] error fetching category details", e);
			},
		});
	}
});