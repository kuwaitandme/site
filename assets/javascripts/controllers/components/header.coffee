exports = module.exports = ($scope, $rootScope) ->
  @name = "[component:header]"
  console.log @name, "initializing"

  $scope.showNavigation = ->
  $scope.hideNavigation = ->

  $scope.toggleHeader = ->
    currentState = $rootScope.extraClass["show-subheader"]
    $rootScope.extraClass = $rootScope.extraClass or {}
    $rootScope.extraClass["show-subheader"] = not currentState
  $scope.closeHeader = -> $rootScope.extraClass = ""

exports.$inject = [
  "$scope"
  "$rootScope"
]