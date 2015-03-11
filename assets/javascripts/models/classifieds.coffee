ajax = app.helpers.ajax

module.exports = Backbone.Collection.extend
	model: require('./classified')
	isAccount: false

	fetch: (parameters = {}) ->
		that = this

		# Generate the URL to send the request to
		if not @isAccount then baseUrl = '/classified/search?'
		else baseUrl = '/account/manage?'
		url = app.config.host + baseUrl + $.param(parameters)

		# Send the AJAX request
		$.ajax
			type: 'POST'
			url: url
			dataType: 'json'
			# data: parameters
			beforeSend: ajax.setHeaders
			success: (response) ->
				console.debug '[model:classifieds] fetching classifieds', response
				newModels = []

				# For each classified convert it into a Backbone.Model and
				# push it into a temporary array
				for classified in response
					model = new (that.model)(classified)
					model.trigger 'parse'
					newModels.push model

				# Add the classifieds into our collection
				that.add newModels

				# Signal any listeners that we are done loading the
				# classifieds
				that.trigger 'ajax:done', newModels

			error: (e) ->
				console.error '[model:classifieds] error fetching classifieds', e