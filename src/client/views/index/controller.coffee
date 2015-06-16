exports = module.exports = ($scope, $scroller, $root, $log, $ga, Classifieds) ->
  @name = "[page:landing]"
  $log.log @name, "initializing"
  $scope.gotoElement = (eID) -> setTimeout (-> $scroller.scrollTo eID), 100

  $scope.heroURL = "landing.jpg"
  $scope.displayClassifiedList = true
  $scope.$emit "page-loaded"
  $scope.onHeroLoad = ->

  $scope.showAuth = -> $root.$broadcast "show:auth-modal"

  $scope.trackEvent = (action) ->
    $ga.trackEvent "Call to action", "click"

  $scope.query = status: Classifieds.statuses.ACTIVE

exports.$inject = [
  "$scope"
  "$scroller"
  "$rootScope"
  "$log"

  "Google.Analytics"
  "models.classifieds"
]
