exports = module.exports = ($location, $http, console, user) ->
  @name = "[page:auth-logout]"
  console.log @name, "initializing"

  user.logout()
  $location.path "/auth/login"
  $location.search "success", "logout"


exports.$inject = [
  "$location"
  "$http"
  "$log"
  "model.user"
]