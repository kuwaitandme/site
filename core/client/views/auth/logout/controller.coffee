Controller = ($location, $log, Notifications, Users) ->
  logger = $log.init Controller.tag
  logger.log "initializing"

  Users.logout()
  Notifications.success "logout_success"
  $location.path "/"


Controller.tag = "page:auth/logout"
Controller.$inject = [
  "$location"
  "$log"
  "@notifications"
  "@models/users"
]
module.exports = Controller