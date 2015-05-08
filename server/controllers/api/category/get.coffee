exports = module.exports = (Categories, cache) ->
  controller = (request, response, next) ->
    response.contentType "application/json"
    # Check in cache
    cache.get "route:api/categories", (error, results) =>
      if results
        return response.end results

      # Categories was not cached, so query and then save in cache
      Categories.getAll (error, results) ->
        json = JSON.stringify results, null, 2
        cache.set "route:api/categories", json
        response.end json


exports["@singleton"] = true
exports["@require"] = [
  "models/categories"
  "controllers/cache"
]