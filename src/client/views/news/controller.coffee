name = "[page:news]"


exports = module.exports = ($scope, $root, $stateParams, $log, $http, $location) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams


  if /recent/.test $location.path() then $scope.ifRecent = "/recent"

  $http.pageAsJSON().success (data) ->
    $scope.pagination = data.pagination
    $scope.stories = data.collection
    $scope.$emit "page:loaded"


exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "$http"
  "$location"
]
