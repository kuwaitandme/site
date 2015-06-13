exports = module.exports = ($environment, $location, $log, $notifications,
$scope, $stateParams, Classifieds) ->
  @name = "[page:account-cl-single]"
  $log.log @name, "initializing"

  # Fetch the classified from the API
  Classifieds.get $stateParams.id, (error, classified) ->
    staticUrl = $environment.staticUrl
    for image in classified.images or []
      image.status = "on-server"
      image.src = "#{ staticUrl }/uploads/thumb/#{image.filename}"
    $scope.classified = classified
    $scope.$emit "page-loaded"

  # When classified has been edited successfully, redirect to the account page
  $scope.$on "classified-form:submitted", ($event, classified) ->
    $notifications.success "This classified has been moderated successfully!"
    $location.path "/account/moderate"


exports.$inject = [
  "$environment"
  "$location"
  "$log"
  "$notifications"
  "$scope"
  "$stateParams"

  "models.classifieds"
]
