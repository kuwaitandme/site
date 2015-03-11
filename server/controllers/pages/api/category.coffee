async = require 'async'
redis = require 'redis'

client = redis.createClient null, null, detect_buffers: true

config = global.config

controller = module.exports =
	get: (request, response, next) ->
		response.contentType 'application/json'

		category = global.models.category
		classified = global.models.classified

		# Function to run once the async is done it's jobs.
		asyncComplete = (err, results) ->
			if err then throw err
			response.end JSON.stringify results

		# Perform the asynchronous tasks to get the categories and the count
		async.parallel {
			categories: (finish) ->
				client.get 'categories', (err, result) ->
					if result then return finish err, result

					category.getAll (result) ->
						json = JSON.stringify result
						client.set 'categories', json
						finish null, result

			count: (finish) ->
				client.get 'categoriescount', (err, result) ->
					if result then return finish err, result

					classified.classifiedsPerCategory  result ->
						json = JSON.stringify result
						client.set 'categoriescount', json
						finish null, result

		}, asyncComplete