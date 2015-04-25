module.exports = ($scope, $rootScope, $stateParams, classified) ->
  @name = '[page:classified-single]'
  $rootScope.bodyid = 'classified-single'

  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  classified.get $stateParams.id, (error, result) ->
    $scope.classified = result
    console.log result