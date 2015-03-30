getQueryParameters = (require './helpers').getQueryParameters

module.exports = (request, response, next) ->
	response.contentType 'application/json'
	parameters = getQueryParameters request

	page = request.query.page or 1

	finish = (error, classifieds) ->
		if error then next error
		else response.end JSON.stringify classifieds

	classified = global.models.classified
	classified.search parameters, page, false, finish