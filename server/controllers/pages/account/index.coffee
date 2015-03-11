render = require('../../helpers/render')

module.exports =
	get: (request, response, next) ->
		render request, response,
			bodyid: 'account'
			page: 'account/index'
			title: response.__('title.account')


	manage: require('./manage')
	profile: require('./profile')