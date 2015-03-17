validator = require 'validator'

singleController = require '../../pages/classified/single'

module.exports = (request, response, next) ->
	response.contentType 'application/json'
	id = request.params.id

	if not validator.isMongoId id
		response.status 404
		return response.end '{}'

	# Update the view counter asynchronously
	singleController.updateViewCount request, id

	# Retrieve classified from DB
	classified = global.models.classified
	classified.get id, (error, classified) ->
		if error then next error

		# If classified is not found then return 404
		if not classified
			response.status 404
			return response.end '{}'

		response.end JSON.stringify classified