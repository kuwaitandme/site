exports = module.exports = ($location, $log, Users) ->
  @name = "[page:auth-logout]"
  $log.log @name, "initializing"
  Users.logout()
  $location.search "_success", "logout"
  $location.path "/"


exports.$inject = [
  "$location"
  "$log"

  "models.users"
]
