module.exports = ($scope, $rootScope, $scroller) ->
  @name = '[page:landing]'
  console.log @name, 'initializing'
  $rootScope.bodyid = 'landing'

  console.log $scroller
  $scope.gotoElement = (eID) -> setTimeout (-> $scroller.scrollTo eID), 100