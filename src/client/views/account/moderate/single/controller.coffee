name = "[page:account-md-single]"


exports = module.exports = ($environment, $location, $log, $notifications,
$scope, $stateParams, Classifieds) ->
  $log.log name, "initializing"

  # Fetch the classified from the API
  Classifieds.get $stateParams.id
  .then (classified) ->
    $scope.$emit "page-loaded"
    $scope.classified = classified

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
