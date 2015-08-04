name = "[page:users/single]"


exports = module.exports = ($scope, $root, $stateParams, $log, $http, $location) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams


  $http.pageAsJSON().success (data) ->
    data.count =
      views: 100000 * Math.random()
      stories: 100000 * Math.random()
      forumPosts: 100000 * Math.random()
      sharing: 100 * Math.random()

    $scope.user = data
    $scope.$emit "page:loaded"


exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "$http"
  "$location"
]
