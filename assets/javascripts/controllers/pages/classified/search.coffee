module.exports = ($scope, $rootScope, $stateParams, classified, $element) ->
  @name = '[page:classified-search]'
  $rootScope.bodyid = 'classified-search'

  body = document.getElementsByTagName "body"
  body[0].id = "classified-search"

  console.log @name, "initializing"

  # classified.get $stateParams.id, (error, result) =>
  #   $scope.classified = result

  #   setTimeout =>
  #     $imgContainer =  angular.element $element[0].querySelector '.gallery'
  #     @masonry = new Masonry $imgContainer[0], itemSelector: 'li'
  #     $scope.update = =>
  #       console.log 'updating'
  #       @masonry.layout()
  #   , 100