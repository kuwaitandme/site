classified = global.models.classified

controller = module.exports =
	get: (request, response, next) ->
		args =
			bodyid: 'guest-post'
			description: null
			page: 'classified/post'
			title: response.__('title.guest.post')
			data: guest: true

		render = global.helpers.render
		render request, response, args, true