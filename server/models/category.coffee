mongoose = require 'mongoose'

categories = module.exports =
	model: mongoose.model('categories',
		name: String
		children:
			name: String)

	# Returns all the classifieds in the database.
	getAll: (callback) ->
		@model.find {}, (err, result) ->
			callback result