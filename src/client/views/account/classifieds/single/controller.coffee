name = "[page:account-cl-single]"


exports = module.exports = ($environment, $location, $log, $notifications,
$scope, $stateParams, Classifieds) ->
  $log.log name, "initializing"

  # Fetch the classified from the API
  Classifieds.get $stateParams.id
  .then (classified) ->
    $scope.$emit "page-loaded", allowBackNavigation: true
    $scope.classified = classified

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
