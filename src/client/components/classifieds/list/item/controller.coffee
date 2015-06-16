exports = module.exports = ($scope, Classifieds) ->

  $scope.$watch "cl", (data) ->
    $scope.classified = Classifieds.toModel data
    $scope.mainImage = $scope.classified.mainImage()


exports.$inject = [
  "$scope"

  "models.classifieds"
]
