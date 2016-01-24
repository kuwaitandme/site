###
@api {get} /locations Gets all the locations saved in the database
@apiName GetLocation
@apiGroup Locations

@apiVersion 1.0.0
###
Controller = module.exports = (Locations, Cache) ->
  (request, response, next) ->
    location = new Locations
    location.fetchAll().then (collection) -> response.json collection
    .catch (e) -> next e


Controller["@require"] = [
  "models/locations"
  "libraries/cache"
]
Controller["@routes"] = ["/locations"]
Controller["@singleton"] = true