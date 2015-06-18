exports = module.exports = (Locations, Cache) ->
  controller = (request, response, next) ->
    response.contentType "application/json"
    cacheKey = "route:api/locations"

    # Check in cache
    Cache.get cacheKey

    # The Locations were not cached, so query and then save in cache
    .catch ->

      # Get all the locations from the DB.
      Locations.getAll()
      .then (results) ->
        Cache.set cacheKey, JSON.stringify results, null, 2

    # This promise only executes when the locations have been fetched (either
    # from the DB or from the cache)
    .then (results) ->
      response.contentType "application/json"
      response.end results
    .catch (error) -> next error


exports["@require"] = [
  "models/locations"
  "controllers/cache"
]
exports["@singleton"] = true
