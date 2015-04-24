module.exports = ($scope, $rootScope) ->
  @name = '[page:landing]'
  console.log @name, 'initializing'

  $rootScope.bodyid = 'landing'
  $scope.firstName = 'John'
  $scope.lastName = 'Doe'