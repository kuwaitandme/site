exports = module.exports = ($location, $http, console, $notifications, Users) ->
  @name = "[page:auth-logout]"
  console.log @name, "initializing"

  $notifications.create "You have been logged out successfully"
  Users.logout()
  $location.path "/auth"


exports.$inject = [
  "$location"
  "$http"
  "$log"
  "$notifications"

  "model.users"
]