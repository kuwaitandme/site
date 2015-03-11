render = require('../../helpers/render')

controller = module.exports =

	get: (request, response, next) ->
		render request, response,
			bodyid: 'account-profile'
			page: 'account/profile'
			title: response.__('title.privacy')