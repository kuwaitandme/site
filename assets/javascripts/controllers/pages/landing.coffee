module.exports = ($scope, $scroller) ->
  @name = '[page:landing]'
  console.log @name, 'initializing'

  body = document.getElementsByTagName "body"
  body[0].id = "landing"

  console.log $scroller
  $scope.gotoElement = (eID) -> setTimeout (-> $scroller.scrollTo eID), 100