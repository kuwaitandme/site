redis = require 'redis'
mongoose = require 'mongoose'
client = redis.createClient null, null, detect_buffers: true

locations = module.exports =
	model: mongoose.model('locations', name: String)

	# Returns all the locations in the database.
	getAll: (callback) ->

		finish = (err, locations) ->
			if err then throw err
			callback locations

		client.get 'locations', (err, result) ->
			if err then return finish err, null
			if result then return finish null, JSON.parse result

			locations.model.find {}, (err, result) ->
				if err then return finish err, null

				json = JSON.stringify result
				client.set 'locations', json
				finish null, result