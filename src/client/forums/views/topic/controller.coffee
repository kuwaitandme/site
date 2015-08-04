name = "[page:forums/category]"


exports = module.exports = ($scope, $root, $stateParams, $log, $http, $location, $sce) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams

  $http.pageAsJSON().success (data) ->
    $scope.topic = data.topic
  $scope.$emit "page:loaded"


exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "$http"
  "$location"
  "$sce"
]


# name = "[page:classified-single]"


# exports = module.exports = ($scope, $root, $stateParams, $log, Categories, Topics, $sce) ->
#   $log.log name, "initializing"
#   $log.debug name, "routeParams", $stateParams


#   $scope.categories = Categories.getAll()
#   Topics.get().success (data) ->

#     $scope.topic = data.collection[0]
#     $scope.topic.excerpt = $sce.trustAsHtml $scope.topic.excerpt + "..."
#   $scope.$emit "page:loaded"


# exports.$inject = [
#   "$scope"
#   "$rootScope"
#   "$stateParams"
#   "$log"

#   "models.forums.categories"
#   "models.forums.topics"
#   "$sce"
# ]
