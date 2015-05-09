exports = module.exports = ($scope, $rootScope, console) ->
  @name = "[component:header]"
  console.log @name, "initializing"

  $scope.showNavigation = ->
  $scope.hideNavigation = ->

  $scope.toggleHeader = ->
    $rootScope.bodyClasses = $rootScope.bodyClasses or {}
    currentState = $rootScope.bodyClasses["show-subheader"]
    $rootScope.bodyClasses["show-subheader"] = not currentState
  $scope.closeHeader = -> $rootScope.bodyClasses["show-subheader"] = false

exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
]