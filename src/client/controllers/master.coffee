exports = module.exports = ($scope, $root, console) ->
  @name = "[controller:master]"
  console.log @name, "initializing"
  $scope.meta = $root.meta =
    robotsNoIndex: false

exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
]