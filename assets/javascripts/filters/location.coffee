exports = module.exports = (location) ->
  (locationId) ->
    cat = location.findById locationId
    cat.name

exports.$inject = ["model.location"]