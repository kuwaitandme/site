# Controller for the terms and conditions page. Simply displays the 'terms and
# conditions' view.
controller = module.exports =
	get: (request, response, next) ->
		render = global.helpers.render
		render request, response,
			bodyid: 'terms'
			page: 'terms'
			title: response.__('title.terms')