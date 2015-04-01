mongoose = require 'mongoose'


# This is a model that contains locations of different provinces
locations = module.exports =
  model: mongoose.model('locations', name: String)

  # Returns all the locations in the database.
  getAll: (callback) ->

    # First check in the memory cache for the locations
    global.cache.get 'locations', (error, result) =>
      if error then return callback error, null
      if result then return callback null, JSON.parse result

      # If not then get the locations from the DB before saving it back
      # into memory cache
      query = @model.find {}
      .sort _id: 1

      query.exec (error, result) ->
        if error then return callback error, null

        json = JSON.stringify result
        global.cache.set 'locations', json
        callback null, result