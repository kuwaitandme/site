## TODO: Add automatic resize of content
exports = module.exports = ($scope, console, $location, $notifications,
Users) ->
  @name = "[page:classified-create]"
  console.log @name, "initializing"

  # When classified has been submitted successfully, redirect to the finish
  # page
  $scope.$on "classified-form:submitted", ($event, classified) ->
    $notifications.success "Your classified has been submitted successfully!"
    $location.path "/classified/finish/#{classified.id}"

  $scope.classified = {}

  $scope.$emit "page-loaded"

exports.$inject = [
  "$scope"
  "$log"
  "$location"
  "$notifications"

  "models.users"
]
