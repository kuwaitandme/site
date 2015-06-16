exports = module.exports = ($scope, $scroller, $log) ->
  @name = "[page:landing]"
  $log.log @name, "initializing"
  $scope.gotoElement = (eID) -> setTimeout (-> $scroller.scrollTo eID), 100


exports.$inject = [
  "$scope"
  "$scroller"
  "$log"
]
