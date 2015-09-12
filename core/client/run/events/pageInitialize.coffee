EventHandler = ($ga, $location, $log, $root, Notifications, Users) ->
  logger = $log.init EventHandler.tag
  logger.log "initialized"

  $root.bodyClasses ?= {}

  $root.$on "page:initialize", (event, value={}) ->
    logger.log "captured event!"

    # If the login property is set then check if the user is logged in.
    if value.needLogin and not Users.isLoggedIn()
      logger.info "user needs to be logged in for this page"

      # Redirect the user to the login page
      $location.search redirectTo: $location.url()
      $location.path "/login"

      # Pop up a notification.
      Notifications.warn "login_needed"

    # Send a pageview in google analytics
    $ga.sendPageView()


EventHandler.tag = "event:pageInitialize"
EventHandler.$inject = [
  "$google/analytics"
  "$location"
  "$log"
  "$rootScope"
  "@notifications"
  "@models/users"
]
module.exports = EventHandler