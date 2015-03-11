async = require 'async'
redis = require 'redis'

client = redis.createClient null, null, detect_buffers: true

controller = module.exports =
	get: (request, response, next) ->
		response.contentType 'application/json'

		finish = (err, categories) ->
			if err then throw err
			response.end JSON.stringify categories

		client.get 'categories', (err, result) ->
			if result then return finish err, result

			category = global.models.category
			category.getAll (result) ->
				json = JSON.stringify result
				client.set 'categories', json
				finish null, result