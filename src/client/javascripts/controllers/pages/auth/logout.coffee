exports = module.exports = ($location, $log, Users) ->
  @name = "[page:auth-logout]"
  $log.log @name, "initializing"
  Users.logout()
  $location.path "/auth?_success=logout"


exports.$inject = [
  "$location"
  "$log"

  "model.users"
]