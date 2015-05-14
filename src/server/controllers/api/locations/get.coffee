exports = module.exports = (Locations, cache) ->
  controller = (request, response, next) ->
    response.contentType "application/json"

    # Check in cache
    cache.get "route:api/locations", (error, results) =>
      if results then return response.end results

      # Categories was not cached, so query and then save in cache
      Locations.getAll (error, collection) ->
        json = JSON.stringify collection, null, 2
        cache.set "route:api/locations", json
        response.end json


exports["@require"] = [
  "models/locations"
  "controllers/cache"
]
exports["@singleton"] = true