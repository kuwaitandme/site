exports = module.exports = ($scope, $scroller, $log, Classifieds) ->
  @name = "[page:landing]"
  $log.log @name, "initializing"
  $scope.gotoElement = (eID) -> setTimeout (-> $scroller.scrollTo eID), 100

  $scope.heroURL = "landing.jpg"
  $scope.onHeroLoad = ->
    $scope.displayClassifiedList = true
    $scope.$emit "page-loaded"

  $scope.query = status: Classifieds.statuses.ACTIVE

exports.$inject = [
  "$scope"
  "$scroller"
  "$log"

  "model.classifieds"
]