module.exports = (request, response, next) ->
	response.contentType 'application/json'

	category = global.models.category
	category.getAll (error, result) ->
		if error then next error

		json = JSON.stringify result
		response.end json