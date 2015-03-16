getQueryParameters = (request) ->
	parameters = {}

	classified = global.models.classified

	if request.user and request.user.isAdmin
		parameters.status = classified.status.INACTIVE
	else parameters.owner = request.user._id

	parameters


module.exports = (request, response, next) ->
	if not request.isAuthenticated()
		return response.redirect '/auth/login?error=need_login'

	parameters = getQueryParameters request
	page = request.query.page or 0

	console.log parameters

	finish = (classifieds) -> response.end JSON.stringify(classifieds)

	classified = global.models.classified
	classified.search parameters, finish, page, true