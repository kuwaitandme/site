# Credit to https://codepen.io/kyleHenwood/pen/Alayb
exports = module.exports = ($scope) ->
  isClosed = true

  classes = $scope.classes = {}
  $scope.color = "#000"

  set = (value) ->
    isClosed = value
    $scope.classes["is-closed"] = isClosed
    $scope.classes["is-open"] = !isClosed

  $scope.$on "hamburger:open", -> set false
  $scope.$on "hamburger:close", -> set true
  # $scope.$on "hamburger:color", (color) -> $scope.color = color

exports.$inject = ["$scope"]
