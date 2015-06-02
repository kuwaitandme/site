## TODO: Add automatic resize of content
exports = module.exports = ($scope, console, $location, $notifications,
Users) ->
  @name = "[page:classified-post]"
  console.log @name, "initializing"
  console.debug @name, $scope

  # When classified has been submitted successfully, redirect to the finish
  # page
  $scope.$on "classified-form:submitted", ($event, classified) ->
    $notifications.success "Your classified has been submitted successfully!"
    $location.path "/classified/finish/#{classified.id}"

  $scope.isUserLoggedIn = Users.isLoggedIn()
  if not Users.isLoggedIn()
    $location.search "_error", "need_login_for_post"
    $location.path "/auth"

  $scope.heroURL = "landing.jpg"
  $scope.onHeroLoad = -> $scope.$emit "page-loaded"

exports.$inject = [
  "$scope"
  "$log"
  "$location"
  "$notifications"

  "models.users"
]
