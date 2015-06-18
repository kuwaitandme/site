exports = module.exports = (Categories, Cache, email) ->
  controller = (request, response, next) ->
    response.contentType "application/json"
    cacheKey = "route:api/categories"

    # Check in the cache first.
    Cache.get cacheKey

    # If nothing was found in the cache then we re-query the DB.
    .catch (results) ->
      # Get all the categories from the DB.
      Categories.getAll()
      .then (results) ->
        json = JSON.stringify results, null, 2
        Cache.set cacheKey, json

    # This promise only executes when the categories have been fetched (either
    # from the DB or from the cache)
    .then (results) ->
      response.contentType "application/json"
      response.end results
    .catch (error) -> next error


exports["@singleton"] = true
exports["@require"] = [
  "models/categories"
  "controllers/cache"
  "controllers/email"
]
