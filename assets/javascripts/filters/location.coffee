exports = module.exports = (Locations) ->
  (locationId) ->
    location = Locations.findById locationId
    location.name


exports.$inject = ["model.locations"]