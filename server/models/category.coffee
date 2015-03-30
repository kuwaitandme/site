mongoose = require 'mongoose'


# The model for a classified category
categories = module.exports =
	model: mongoose.model 'categories',
		name: String


	# Gets all the classifieds in the database. Ideally this should be the only
	# function this model should ever have. The front-end JS takes the heavy
	# burden of performing different functions with it.
	getAll: (callback) ->

		# First check in the memory cache for the categories
		global.cache.get 'categories', (error, result) =>
			if error then return callback error, null
			if result then return callback null, JSON.parse result

			# If not then get the categories from the DB before saving it back
			# into the memory cache
			query = @model.find {}
			.sort _id: 1

			query.exec (error, result) ->
				if error then return callback error, null

				json = JSON.stringify result
				global.cache.set 'categories', json
				callback null, result