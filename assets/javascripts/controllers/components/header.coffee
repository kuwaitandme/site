exports = module.exports = ($scope, $rootScope, console) ->
  @name = "[component:header]"
  console.log @name, "initializing"

  $scope.showNavigation = ->
  $scope.hideNavigation = ->

  $scope.toggleHeader = ->
    $rootScope.bodyStyles = $rootScope.bodyStyles or {}
    currentState = $rootScope.bodyStyles["show-subheader"]
    $rootScope.bodyStyles["show-subheader"] = not currentState
  $scope.closeHeader = -> $rootScope["show-subheader"] = false

exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
]