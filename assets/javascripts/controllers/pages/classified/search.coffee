exports = module.exports = ($scope, $element, classified, category) ->
  @name = "[page:classified-search]"
  console.log @name, "initializing"

  body = document.getElementsByTagName "body"
  body[0].id = "classified-search"


  # classified.get $stateParams.id, (error, result) =>
  #   $scope.classified = result

  #   setTimeout =>
  #     $imgContainer =  angular.element $element[0].querySelector ".gallery"
  #     @masonry = new Masonry $imgContainer[0], itemSelector: "li"
  #     $scope.update = =>
  #       console.log "updating"
  #       @masonry.layout()
  #   , 100


exports.$inject = [
  "$scope"
  "$element"
  "model.classified"
  "model.category"
]