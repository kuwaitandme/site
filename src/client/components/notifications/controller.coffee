name = "[component:notification]"

exports = module.exports = ($scope, $root, console, $timeout) ->
  console.log name, "initializing"

  # Use this to adjust how long the flash notifications stay on the header,
  # before they disappear
  flashNotificationLifetime = 5000

  $scope.flashNotifications = []
  $scope.unreadNotifications = 12
  $scope.notifications = []


  # When a new notification gets added, run the below function to display it
  # properly
  onNotificationAdded = (notifications) ->
    # For every notification check if it has been flashed to the user or not.
    # if it has, then flash it and then add it to the sub header.
    # for notification in notifications
    #   if not notification.hasFlashedToUser
    #     notification.hasFlashedToUser = true
  $scope.$watch "notifications", onNotificationAdded, true

  # Add a listener for when notifications get marked as 'read' to update the
  # counter
  onNotificationRead = (notifications) ->
    $scope.unreadNotifications = 0
    for notification in notifications
      if not notification.hasRead then $scope.unreadNotifications++
  $scope.$watch "notifications", onNotificationRead, true


  # This function gets called when the close button in the flash notifications
  # has been pressed.
  $scope.closeFlashNotification = (index) ->
    closedNotification = ($scope.flashNotifications.splice index, 1)[0]
    for notification in $scope.notifications
      if notification.$$hashkey is closedNotification.$$hashkey
        notification.hasRead = true


  # Listen for a notification event and add the new notification
  $scope.$on "notification", (event, notification) ->
    $scope.flashNotifications.push notification
    lifetime = notification.timeout or flashNotificationLifetime
    # Set a timeout function to remove the notification
    ((notifications) -> $timeout ->
      index = $scope.flashNotifications.indexOf notification
      if index? then $scope.flashNotifications.splice index, 1
    , lifetime) notification
    # If it was a regular notification then add it to the header
    if not notification.flash then $scope.notifications.push notification


exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
]
