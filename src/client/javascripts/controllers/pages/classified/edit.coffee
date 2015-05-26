exports = module.exports = ($scope, $stateParams, console, $location,
  $notifications, $environment, Classifieds) ->
  @name = "[page:classified-edit]"
  console.log @name, "initializing", $environment
  console.debug @name, $scope

  staticUrl = $environment.staticUrl

  $scope.heroURL = "landing.jpg"
  Classifieds.get $stateParams.id, (error, classified) =>
    for image in classified.images or []
      image.status = "on-server"
      image.src = "#{ staticUrl }/uploads/thumb/#{image.filename}"
    $scope.classified = classified
    $scope.$emit "page-loaded"

  # When classified has been edited successfully, redirect to the account page
  $scope.onSuccess = (classified) ->
    $notifications.success "Your classified has been edited successfully!"
    $location.path "/account/manage"


exports.$inject = [
  "$scope"
  "$stateParams"
  "$log"
  "$location"
  "$notifications"
  "$environment"

  "model.classifieds"
]