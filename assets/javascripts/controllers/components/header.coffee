exports = module.exports = ($scope, $rootScope) ->
  @name = '[component:header]'
  console.log @name, "initializing"

  $scope.showNavigation = ->
  $scope.hideNavigation = ->

  $scope.toggleHeader = ->
    cl = $rootScope.extraClass
    $rootScope.extraClass = if cl is 'show-subheader' then '' else 'show-subheader'


exports.$inject = [
  '$scope'
  '$rootScope'
]