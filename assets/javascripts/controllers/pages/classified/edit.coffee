exports = module.exports = ($scope, $stateParams, console, Classifieds) ->
  @name = "[page:classified-edit]"
  console.log @name, "initializing",

  Classifieds.get $stateParams.id, (error, classified) =>
    for image in classified.images or []
      image.status = "on-server"
      image.src = "/uploads/thumb/#{image.filename}"
    $scope.classified = classified


exports.$inject = [
  "$scope"
  "$stateParams"
  "$log"

  "model.classifieds"
]