module.exports = ($scope, $rootScope) ->
  @name = '[page:landing]'
  console.log @name, 'initializing'
  $rootScope.bodyid = 'auth-signup'