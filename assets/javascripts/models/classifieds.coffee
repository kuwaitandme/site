# This file contains a Backbone.Collection.. blah blah

ajax = (require 'app-helpers').ajax

module.exports = Backbone.Collection.extend
	consoleSlug: '[model:classifieds]'

	model: require './classified'
	isAccount: false

	fetch: (parameters = {}) ->
		that = @

		# Generate the URL to send the request to
		if not @isAccount then baseUrl = '/api/query?'
		else baseUrl = '/api/account/manage?'
		url = app.config.host + baseUrl + $.param(parameters)

		# Send the AJAX request
		$.ajax
			type: 'POST'
			url: url
			dataType: 'json'
			# data: parameters
			beforeSend: ajax.setHeaders
			success: (response) ->
				console.debug that.consoleSlug, 'fetching classifieds', response
				newModels = []

				# For each classified convert it into a Backbone.Model and
				# push it into a temporary array
				for classified in response
					model = new that.model classified
					model.trigger 'parse'
					newModels.push model

				# Add the classifieds into our collection
				that.add newModels

				# Signal any listeners that we are done loading the
				# classifieds
				that.trigger 'ajax:done', newModels

			error: (response) ->
				console.error that.consoleSlug, 'error fetching classifieds', response