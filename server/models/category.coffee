mongoose = require 'mongoose'
redis = require 'redis'
client = redis.createClient null, null, detect_buffers: true

categories = module.exports =
	model: mongoose.model('categories',
		name: String
		children:
			name: String)

	# Returns all the classifieds in the database.
	getAll: (callback) ->

		finish = (err, categories) ->
			if err then throw err
			callback categories

		client.get 'categories', (err, result) ->
			if err then return finish err, null
			if result then return finish null, result

			categories.model.find {}, (err, result) ->
				if err then return finish err, null

				json = JSON.stringify result
				client.set 'categories', json
				finish null, result