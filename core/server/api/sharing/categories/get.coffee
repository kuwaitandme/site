exports = module.exports = (Categories, Cache, email) ->
  routes: ["/sharing/categories"]
  controller: (request, response, next) ->
    response.contentType "application/json"
    cacheKey = "route:api/categories"

    # Check in the cache first.
    Cache.get cacheKey

    # If nothing was found in the cache then we re-query the DB.
    .catch ->

      # Get all the categories from the DB.
      Categories.getAll()
      .then (results) -> Cache.set cacheKey, JSON.stringify results, null, 2

    # This promise only executes when the categories have been fetched (either
    # from the DB or from the cache)
    .then (results) ->
      response.contentType "application/json"
      response.end results

    # Error handler
    .catch next


exports["@singleton"] = true
exports["@require"] = [
  "models/sharing/categories"
  "libraries/cache"
  "libraries/email"
]
