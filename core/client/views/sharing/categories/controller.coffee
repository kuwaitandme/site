Controller = ($scope, $root, $cookies, $log, $http, Categories) ->
  logger = $log.init Controller.tag
  logger.log "initializing"
  $scope.$emit "page:initialize"

  # Setup variables. use 'f' as the key to store the filter attributes.
  cookiesKey = "f"
  $scope.filters = {}

  # Read the blocked categories from our encoded cookie!
  cookiesFilterString = $cookies.get(cookiesKey) or ""
  for key in cookiesFilterString.split "-"
    if key.length > 0 then $scope.filters[key] = true

  # Fetch data from the page.
  $http.pageAsJSON().success (data) ->
    categories = $scope.categories = data.categories or []
    counters = data.counters or []

    for cat in $scope.categories then for counter in counters
      cat.counter = 0
      if cat.id is counter.category
        cat.counter = counter.stories
        break

    $scope.$emit "page:start"

  # Save the filters.
  $scope.saveFilters = (filters) ->
    cookieString = ""
    for id of filters then if filters[id] then cookieString += "#{id}-"
    $cookies.put cookiesKey, cookieString


Controller.tag = "page:sharing/categories"
Controller.$inject = [
  "$scope"
  "$rootScope"
  "$cookies"
  "$log"
  "$http"
  "@models/sharing/categories"
]
module.exports = Controller