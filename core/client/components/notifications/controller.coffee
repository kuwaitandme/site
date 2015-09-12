NotificationComponent = ($log, $root, $scope, $timeout) ->
  logger = $log.init NotificationComponent.tag
  logger.log "initializing"
  $scope.notifications = []

  # Use this to adjust how long the flash notifications stay on the header,
  # before they disappear.
  notificationLifetime = 7 * 1000

  # Listen for a notification event to add the a flash notification
  $root.$on "notifications:add", (event, data) ->
    notification = data
    console.log data
    $timeout -> $scope.notifications.push notification
    # index = $scope.notifications.indexOf notification

    # Set a timeout function to remove the notification
    do (notification) -> $timeout ->
      notification.hasRead = true
    , notificationLifetime


NotificationComponent.tag = "component:notification"
NotificationComponent.$inject = [
  "$log"
  "$rootScope"
  "$scope"
  "$timeout"
]
module.exports = NotificationComponent