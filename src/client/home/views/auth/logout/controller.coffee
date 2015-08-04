name = "[page:auth-logout]"


exports = module.exports = ($location, $log, Users) ->
  $log.log name, "initializing"
  $location.path "/"
  Users.logout()


exports.$inject = [
  "$location"
  "$log"

  "models.users"
]
