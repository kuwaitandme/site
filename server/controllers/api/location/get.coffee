exports = module.exports = (Locations, cache) ->
  controller = (request, response, next) ->
    response.contentType "application/json"

    # Check in cache
    cache.get "locations", (error, results) =>
      if results then return response.end results

      # Categories was not cached, so query and then save in cache
      new Locations().fetch().then (collection) ->
        json = JSON.stringify collection, null, 2
        cache.set "locations", json
        response.end json


exports["@require"] = [
  "models/locations"
  "controllers/cache"
]
exports["@singleton"] = true