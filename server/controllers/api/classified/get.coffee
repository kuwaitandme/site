classified = global.models.classified

module.exports = (request, response, next) ->
	response.contentType 'application/json'
	id = request.params.id

	# Check to see if classified is in DB
	classified.get id, (classified) ->

		# If classified is not found then return 404
		if not classified
			response.status 404
			response.end '{}'

		response.end JSON.stringify classified