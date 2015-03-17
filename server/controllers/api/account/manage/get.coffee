getQueryParameters = (request) ->
	parameters = {}

	classified = global.models.classified

	if request.user and request.user.isAdmin
		parameters.status = classified.status.INACTIVE
	else parameters.owner = request.user._id

	parameters


module.exports = (request, response, next) ->
	if not request.isAuthenticated()
		response.status 401
		return response.end '"need authentication"'

	parameters = getQueryParameters request
	page = request.query.page or 0

	finish = (err, classifieds) ->
		if err then next err
		else response.end JSON.stringify(classifieds)

	classified = global.models.classified
	classified.search parameters, page, true, finish