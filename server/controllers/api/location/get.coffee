module.exports = (request, response, next) ->
	response.contentType 'application/json'

	location = global.models.location
	location.getAll (result) ->
		json = JSON.stringify result
		response.end json