module.exports = ($scope, $stateParams, classified, $element) ->
  @name = '[page:classified-single]'

  console.log @name, "initializing"
  console.debug @name, "routeParams", $stateParams

  body = document.getElementsByTagName "body"
  body[0].id = "classified-single"

  classified.get $stateParams.id, (error, result) =>
    $scope.classified = result

    setTimeout =>
      $imgContainer =  angular.element $element[0].querySelector '.gallery'
      @masonry = new Masonry $imgContainer[0], itemSelector: 'li'
      $scope.update = =>
        console.log 'updating'
        @masonry.layout()
    , 100