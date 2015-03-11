config = global.config

controller = module.exports =

	get: (request, response, next) ->
		response.contentType 'application/json'
		response.end JSON.stringify
			author: 'Steven Enamakel'
			status: 'online'
			jsVersion: config.jsVersion

	category: require './category'
	location: require './location'
	user: require './user'