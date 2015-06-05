exports = module.exports = ($environment, $location, $log, $notifications,
$scope, $stateParams, Classifieds) ->
  @name = "[page:account-cl-single]"
  $log.log @name, "initializing"

  staticUrl = $environment.staticUrl

  $scope.heroURL = "landing.jpg"
  Classifieds.get $stateParams.id, (error, classified) ->
    for image in classified.images or []
      image.status = "on-server"
      image.src = "#{ staticUrl }/uploads/thumb/#{image.filename}"
    $scope.classified = classified
    $scope.$emit "page-loaded"

  # When classified has been edited successfully, redirect to the account page
  $scope.$on "classified-form:submitted", ($event, classified) ->
    $notifications.success "Your classified has been edited successfully!"
    $location.path "/account/classifieds"


exports.$inject = [
  "$environment"
  "$location"
  "$log"
  "$notifications"
  "$scope"
  "$stateParams"

  "models.classifieds"
]
