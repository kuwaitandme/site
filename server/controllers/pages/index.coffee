
# Description for the meta tag
description = 'Sell things that you don\'t want. Buy things at bargain prices!
	Publishing free classifieds in Kuwait have never been so quick and easy.'

# Controller for the landing page. Displays the front-page with the top
# classifieds and categories to choose from.
controller = module.exports =
	get: (request, response, next) ->
		render = global.helpers.render
		render request, response,
			bodyid: 'landing'
			description: description
			page: 'landing'

			title: response.__('title.landing'),
			true


	routes: (router, base) ->
		router.get base + '/', @get

		(require './account')    .routes router, base
		(require './auth')       .routes router, base
		(require './classified') .routes router, base
		(require './guest')      .routes router, base
		(require './privacy')    .routes router, base
		(require './terms')      .routes router, base
		(require './terms')      .routes router, base