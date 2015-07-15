Promise = require "bluebird"

exports = module.exports = (Classifieds, Cache) ->
  controller = (request, response, next) ->

    # First check our cache to see if the counters have been saved.
    Cache.get "route:api/categories/counters"

    # If nothing in the cache was found, then the function throws an error. We
    # catch it here and re-fill the cache by calculating the counters again..
    .catch ->

      # Async tasks to fetch both the parent and child category's counters
      # from the DB
      Promise.props
        child_category: Classifieds.getChildCategoryCount()
        parent_category: Classifieds.getParentCategoryCount()

      # Once the categories have been fetched, we set it back into the cache
      # and return the output to the user
      .then (counters) ->
        json = JSON.stringify counters, null, 2
        Cache.set "route:api/categories/counters", json

    # This promise only executes when the counters have been fetched (either
    # from the DB or from the cache)
    .then (results) ->
      response.contentType "application/json"
      response.end results

    # Error handler
    .catch next


exports["@singleton"] = true
exports["@require"] = [
  "models/classifieds"
  "libraries/cache"
]
