# This is a model that contains locations of different provinces
exports = module.exports = (IoC, mongoose, cache) ->
	model: mongoose.model 'locations', name: String

	# Returns all the locations in the database.
	getAll: (callback) ->

		# First check in the memory cache for the locations
		cache.get 'locations', (error, result) =>
			if error then return callback error, null
			if result then return callback null, JSON.parse result

			# If not then get the locations from the DB before saving it back
			# into memory cache
			@model.find {}, (error, result) ->
				if error then return callback error, null

				json = JSON.stringify result
				cache.set 'locations', json
				callback null, result

exports["@require"] = [
  "$container"
  "igloo/mongo"
  "controllers/cache"
]
exports['@singleton'] = true