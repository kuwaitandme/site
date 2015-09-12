Controller = ($cookies, $http, $log, $scope, $storage) ->
  logger = $log.init Controller.tag
  logger.log "initializing"
  $scope.$emit "page:initialize"

  # Fetch data from the page.
  $http.pageAsJSON().success (data) ->
    $scope.pagination = data.pagination
    $scope.stories = data.collection
    $scope.$emit "page:start"


Controller.tag = "page:sharing/category"
Controller.$inject = [
  "$cookies"
  "$http"
  "$log"
  "$scope"
  "@storage"
]


# Controller.templateUrl =
# Controller.resolve =
module.exports = Controller