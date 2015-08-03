name = "[page:forums]"


exports = module.exports = ($scope, $root, $stateParams, $log, $http, $location, $sce) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams

  $http.pageAsJSON().success (data) ->
    $scope.pagination = data.pagination

    cat.meta.icon = $sce.trustAsHtml cat.meta.icon for cat in data.collection

    $scope.categories = data.collection
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
