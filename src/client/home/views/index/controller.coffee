name = "[page:landing]"

exports = module.exports = ($scope, $location, $scroller, $root, $log, $ga,
Classifieds) ->
  $log.log name, "initializing"
  $scope.gotoElement = (eID) -> setTimeout (-> $scroller.scrollTo eID), 100

  $scope.heroURL = "landing.jpg"
  $scope.displayClassifiedList = true

  $scope.$emit "page:loaded"

  $scope.showAuth = -> $root.$broadcast "component:auth:show"

  # Everytime a CTA button is clicked, send it to ga..
  $scope.trackEvent = (a) -> $ga.trackEvent "Call to action", "click", a

  # When classified has been clicked, redirect to its page
  $scope.$on "classified-list:click", ($event, data) ->
    $location.path "/#{data.classified.slug}"

  # Set the query for the classified list!
  $scope.classifiedList =
    query:
      status: Classifieds.statuses.ACTIVE

exports.$inject = [
  "$scope"
  "$location"
  "$scroller"
  "$rootScope"
  "$log"

  "Google.Analytics"
  "models.classifieds"
]
