exports = module.exports = ($scope, close, Locations) ->
  $scope.ctrl = {}
  $scope.locations = Locations.getAll()
  $scope.closeModel = -> close()

  $scope.sorts = [
    {
      id: 1
      name: "Latest First"
    }
    {
      id: 2
      name: "Most expensive"
    }
    {
      id: 3
      name: "Most cheapest"
    }
  ]

  $scope.submit = -> close()


exports.$inject = [
  "$scope"
  "close"
  "models.locations"
]
