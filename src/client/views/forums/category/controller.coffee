name = "[page:forums/category]"


exports = module.exports = ($scope, $stateParams, $log, $http) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams

  $http.pageAsJSON().success (data) ->
    $scope.category = data.category
    $scope.topics = data.topics.collection

    $scope.$emit "page:loaded"


exports.$inject = [
  "$scope"
  "$stateParams"
  "$log"
  "$http"
]
