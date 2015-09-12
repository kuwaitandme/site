Controller = ($cookies, $http, $log, $scope, $storage) ->
  logger = $log.init Controller.tag
  logger.log "initializing"
  $scope.$emit "page:initialize"


  # Set the options for the 'results per page' dropdown
  resultOptions = $scope.resultOptions = [20, 30, 40, 50]

  # Get values from the localStorage and cookies for the value of our
  # different options.
  $scope.options =
    resultsPerPage: $cookies.get("rpp") or resultOptions[0]
  $storage.local("options:newtab").then (val) ->
    $scope.options.newtab = val == "true" or false

  # Attach listeners to all our options
  $scope.$watch "options.resultsPerPage", (val) -> $cookies.put "rpp", val
  $scope.$watch "options.newtab", (val) -> $storage.local "options:newtab", val

  # Fetch data from the page.
  $http.pageAsJSON().success (data) ->
    $scope.pagination = data.pagination
    $scope.stories = data.collection
    $scope.$emit "page:start"


Controller.tag = "page:sharing/recent"
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