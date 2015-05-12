## TODO: Add automatic resize of content
exports = module.exports = ($scope, console, $location, $notifications) ->
  @name = "[page:classified-post]"
  console.log @name, "initializing"


  # When classified has been submitted successfully, redirect to the finish
  # page
  $scope.onSuccess = (classified) ->
    $notifications.success "Your classified has been submitted successfully!"
    $location.path "/classified/finish/#{classified.id}"


exports.$inject = [
  "$scope"
  "$log"
  "$location"
  "$notifications"
]