exports = module.exports = ($location, $http, console, Users) ->
  @name = "[page:auth-logout]"
  console.log @name, "initializing"

  Users.logout()
  $location.path "/auth/login"
  $location.search "success", "logout"


exports.$inject = [
  "$location"
  "$http"
  "$log"

  "model.users"
]