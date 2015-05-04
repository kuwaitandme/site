exports = module.exports = ($location, $http, user) ->
  @name = "[page:auth-logout]"
  console.log @name, "initializing"

  user.logout()
  $location.path "/auth/login"
  $location.search "success", "logout"


exports.$inject = [
  "$location"
  "$http"
  "model.user"
]