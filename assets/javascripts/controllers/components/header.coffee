controller = ($scope, $rootScope) ->
  @name = '[component:header]'
  console.log @name, "initializing"

  $scope.toggleHeader = ->
    cl = $rootScope.extraClass
    $rootScope.extraClass = if cl is 'show-subheader' then '' else 'show-subheader'

module.exports = controller