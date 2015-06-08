exports = module.exports = ($location, $log, $root, $scope, $timeout, $window,
Classifieds) ->
  @name = "[component:classified-list]"
  $log.log @name, "initializing"

  $scope.queryFinished ?= false
  $scope.redirectToEditPage ?= false


exports.$inject = [
  "$location"
  "$log"
  "$rootScope"
  "$scope"
  "$timeout"
  "$window"

  "models.classifieds"
]
