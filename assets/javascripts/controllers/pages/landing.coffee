exports = module.exports = ($scope, $scroller) ->
  @name = "[page:landing]"
  console.log @name, "initializing"
  $scope.gotoElement = (eID) -> setTimeout (-> $scroller.scrollTo eID), 100


exports.$inject = [
  "$scope"
  "$scroller"
]