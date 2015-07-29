name = "[page:forums/recent-top]"


exports = module.exports = ($scope, $stateParams, $log, $http, $location) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams

  if /recent/.test $location.path() then $scope.ifRecent = true

  $http.pageAsJSON().success (data) ->
    $scope.category = data.category
    $scope.topics = data.topics.collection

    $scope.$emit "page:loaded"


exports.$inject = [
  "$scope"
  "$stateParams"
  "$log"
  "$http"
  "$location"
]
