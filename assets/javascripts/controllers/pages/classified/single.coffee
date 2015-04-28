module.exports = ($scope, $rootScope, $stateParams, classified, $element) ->
  @name = '[page:classified-single]'
  $rootScope.bodyid = 'classified-single'

  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  classified.get $stateParams.id, (error, result) =>
    $scope.classified = result

    setTimeout =>
      $imgContainer =  angular.element $element[0].querySelector '.gallery'
      @masonry = new Masonry $imgContainer[0], itemSelector: 'li'
      $scope.update = =>
        console.log 'updating'
        @masonry.layout()
    , 100