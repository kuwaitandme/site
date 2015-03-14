module.exports =
	manage: require('./manage')
	profile: require('./profile')

	get: (request, response, next) ->
		if !request.isAuthenticated()
			return response.redirect '/auth/login?error=need_login'

		args =
			bodyid: 'account'
			page: 'account/index'
			title: response.__('title.account')

		render = global.helpers.render
		render request, response, args, true

	routes: (router, base) ->
		router.get base + '/account',         @get
		router.get base + '/account/manage',  @manage.get
		router.get base + '/account/profile', @profile.get