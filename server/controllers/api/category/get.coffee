module.exports = (request, response, next) ->
	response.contentType 'application/json'

	category = global.models.category
	category.getAll (result) ->
		json = JSON.stringify result
		response.end json