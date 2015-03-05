module.exports = Backbone.Collection.extend({
	model: require('./classified'),

	fetch: function(parameters){
		var that = this;

		/* Prepare the URL */
		if(!parameters) parameters = "";
		var url = app.config.host + "/classified/search/" + parameters;

		/* Send the AJAX request */
		$.ajax({
			type: "POST",
			url: url,
			dataType: "json",
			beforeSend: ajax.setHeaders,
			success: function(response) {
				console.debug("Fetching collections", response);
				var newModels = [];

				/* For each classified convert it into a Backbone.Model and
				 * push it into a temporary array */
				_.each(response, function(classified) {
					var model = new that.model(classified);
					model.trigger('parse');
					newModels.push(model);
				});

				/* Add the classifieds into our collection */
				that.add(newModels);

				/* Signal any listeners that we are done loading the
				 * classifieds */
				that.trigger("ajax:done", newModels);
			}, error: function(e) {
				console.error("Error fetching collections", e);
			},
		});
	},
});