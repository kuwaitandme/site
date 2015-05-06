exports = module.exports = (Location) ->
  (locationId) ->
    location = Location.findById locationId
    location.name


exports.$inject = ["model.location"]