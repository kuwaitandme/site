ajax = app.helpers.ajax

module.exports = Backbone.Collection.extend
	model: require('./classified')

	fetch: (parameters = {}) ->
		that = this

		url = app.config.host + '/classified/search?' + $.param(parameters)

		# Send the AJAX request
		$.ajax
			type: 'POST'
			url: url
			dataType: 'json'
			# data: parameters
			beforeSend: ajax.setHeaders
			success: (response) ->
				console.debug '[model:classifieds] fetching collections', response
				newModels = []

				# For each classified convert it into a Backbone.Model and
				# push it into a temporary array
				_.each response, (classified) ->
					model = new (that.model)(classified)
					model.trigger 'parse'
					newModels.push model
					return

				# Add the classifieds into our collection
				that.add newModels

				# Signal any listeners that we are done loading the
				# classifieds
				that.trigger 'ajax:done', newModels

			error: (e) ->
				console.error '[model:classifieds] error fetching collections', e