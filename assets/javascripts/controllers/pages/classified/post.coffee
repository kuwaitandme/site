module.exports = ($scope, $rootScope, $stateParams, classified) ->
  @name = '[page:classified-post]'
  $rootScope.bodyid = 'classified-post'

  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  # classified.get $stateParams.id, (error, result) ->
  #   $scope.classified = result
  #   console.log result