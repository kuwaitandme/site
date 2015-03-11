mongoose = require 'mongoose'

locations = module.exports =
	model: mongoose.model('locations', name: String)

	# Returns all the locations in the database.
	getAll: (callback) -> @model.find {}, (err, result) -> callback result