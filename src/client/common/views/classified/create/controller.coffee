name = "[page:classified-create]"


exports = module.exports = ($scope, $log, $location, $notifications) ->
  $scope.classified = {}
  $log.log name, "initializing"

  # When classified has been submitted successfully, redirect to the finish
  # page
  $scope.$on "classified-form:submitted", ($event, classified) ->
    $notifications.success "Your classified has been submitted successfully!"
    $location.path "/classified/finish/#{classified.id}"


  $scope.$emit "page:loaded", allowBackNavigation: true

exports.$inject = [
  "$scope"
  "$log"
  "$location"
  "$notifications"
]
