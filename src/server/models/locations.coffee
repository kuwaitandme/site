###*
 * [Promise description]
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise = require "bluebird"


exports = module.exports = (BaseModel, Cache) ->
  class Model extends BaseModel
    tableName: "locations"


    ###*
     * [getAll description]
     * @return {[type]} [description]
    ###
    getAll: ->
      cacheKey = "model:locations"

      # Check in cache first
      Cache.get cacheKey

      # If the locations was not found in cache, then start querying the DB
      .catch =>
        # Query the DB
        @collection.forge({}).query()

        # Once the results have been fetched from the DB, we save the
        # locations into the cache.
        .then (results) ->
          # Once parsed, we set the JSON string into the cache.
          Cache.set cacheKey, JSON.stringify results

      # Because the cache stores everything in strings, we parse our JSON string
      # into a proper object to avoid any inconsistencies from the receiving
      # end.
      .then (results) -> JSON.parse results

  new Model


exports["@singleton"] = true
exports["@require"] = [
  "models/base/model"
  "controllers/cache"
]
