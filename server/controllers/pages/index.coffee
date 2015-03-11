
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

			title: response.__('title.landing')


	# Load up other pages here
	account:     require('./account')
	api:         require('./api')
	auth:        require('./auth')
	classified:  require('./classified')
	guest:       require('./guest')
	privacy:     require('./privacy')
	terms:       require('./terms')