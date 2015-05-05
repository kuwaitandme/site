exports = module.exports = (location) ->
  (locationId) ->
    location = location.findById locationId
    location.name


exports.$inject = ["model.location"]