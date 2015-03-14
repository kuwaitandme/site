classified = global.models.classified

controller = module.exports =

	get: (request, response, next) ->
		if !request.isAuthenticated()
			return response.redirect '/auth/login?error=need_login'

		parameters = controller.getQueryParameters(request)

		finish = (classifieds) ->
			args =
				bodyid: 'account-manage'
				page: 'classified/search'

				title: response.__('title.classified.search')
				data: classifieds: classifieds

			render = global.helpers.render
			render request, response, args

		classified.search parameters, finish, 1, true


	# post: (request, response, next) ->
	# 	parameters = controller.getQueryParameters(request)

	# 	if request.query.page then page = request.query.page
	# 	else page = 1

	# 	finish = (classifieds) -> response.end JSON.stringify(classifieds)

	# 	classified.search parameters, finish, page, true


	getQueryParameters: (request) ->
		parameters = {}

		if request.user and request.user.isAdmin
			parameters.status = classified.status.INACTIVE
		else parameters.owner = request.user._id

		parameters