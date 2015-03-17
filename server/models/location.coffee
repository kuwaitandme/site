redis    = require 'redis'
mongoose = require 'mongoose'

client = redis.createClient null, null, detect_buffers: true

# This is a model that contains locations of different provinces
locations = module.exports =
	model: mongoose.model('locations', name: String)

	# Returns all the locations in the database.
	getAll: (callback) ->

		# First check in the redis cache for the locations
		client.get 'locations', (error, result) ->
			if error then return callback error, null
			if result then return callback null, JSON.parse result

			# If not then get the locations from the DB before saving it back
			# into redis
			locations.model.find {}, (error, result) ->
				if error then return callback error, null

				json = JSON.stringify result
				client.set 'locations', json
				callback null, result