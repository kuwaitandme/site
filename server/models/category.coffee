# The model for a classified category
exports = module.exports = (IoC, mongoose, cache) ->
  class Model
    model: mongoose.model 'categories',
      name: String

    # Gets all the classifieds in the database. Ideally this should be the only
    # function this model should ever have. The front-end JS takes the heavy
    # burden of performing different functions with it.
    getAll: (callback) ->
      # First check in the memory cache for the categories
      cache.get 'categories', (error, result) =>
        if error then return callback error, null
        if result then return callback null, JSON.parse result

        # If not then get the categories from the DB before saving it back
        # into the memory cache
        @model.find {}, (error, result) ->
          if error then return callback error, null

          json = JSON.stringify result
          cache.set 'categories', json
          callback null, result

  new Model


exports["@require"] = [
  "$container"
  "igloo/mongo"
  "controllers/cache"
]
exports["@singleton"] = true