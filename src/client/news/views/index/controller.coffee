exports = module.exports = ($scope, $stateParams, $log, $http, $location) ->
  name = "[page:news]"
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams


  if /recent/.test $location.path() then $scope.ifRecent = true


  $http.pageAsJSON().success (data) ->
    $scope.pagination = data.pagination
    $scope.stories = data.collection
    $scope.$emit "page:loaded"


exports.$inject = [
  "$scope"
  "$stateParams"
  "$log"

  "$http"
  "$location"
]
