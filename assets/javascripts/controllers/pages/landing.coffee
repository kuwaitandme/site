exports = module.exports = ($scope, $scroller, console) ->
  @name = "[page:landing]"
  console.log @name, "initializing"
  $scope.gotoElement = (eID) -> setTimeout (-> $scroller.scrollTo eID), 100

  $scope.heroURL = "landing.jpg"
  $scope.onHeroLoad = -> $scope.$emit "page-loaded"

exports.$inject = [
  "$scope"
  "$scroller"
  "$log"
]