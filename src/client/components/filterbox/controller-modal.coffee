exports = module.exports = ($scope, close, Locations) ->
  $scope.ctrl = {}
  $scope.locations = Locations.getAll()
  $scope.closeModel = -> close()


exports.$inject = [
  "$scope"
  "close"
  "models.locations"
]
