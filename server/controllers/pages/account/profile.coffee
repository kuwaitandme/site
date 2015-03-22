render = require('../../helpers/render')

controller = module.exports =

	get: (request, response, next) ->
		if !request.isAuthenticated()
			return response.redirect '/auth/login?error=need_login'

		render request, response,
			page: 'account/profile'
			title: response.__ 'title.account.profile'