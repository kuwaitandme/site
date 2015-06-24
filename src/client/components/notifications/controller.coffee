name = "[component:notification]"

# Use this to adjust how long the toast notifications stay before they
# disappear.
toastNotificationLifetime = 5000

# Use this to adjust how long the flash notifications stay on the header,
# before they disappear.
flashNotificationLifetime = 5000


exports = module.exports = ($scope, $root, $log, $timeout) ->
  $log.log name, "initializing"

  $scope.unreadNotifications = 12
  $scope.notifications = []
  $scope.flashNotifications = []


  # This function gets called when the close button in the flash notifications
  # has been pressed.
  $scope.closeFlashNotification = (index) ->
    closedNotification = ($scope.flashNotifications.splice index, 1)[0]
    for notification in $scope.notifications
      if notification.$$hashkey is closedNotification.$$hashkey
        notification.hasRead = true


  # Listen for a toast notification event to add the new notification
  $root.$on "toast-notification", (event, notification) ->
    console.log event, notification
    $scope.showToast = true
    $scope.toastText = notification
    # Set a timeout function to remove the notification
    $timeout (-> $scope.showToast = false), toastNotificationLifetime


  # Listen for a notification event to add the a flash notification
  $root.$on "notifications:add", (event, data) ->
    notification = data.get()
    console.log notification
    $scope.flashNotifications.push notification

    # Set a timeout function to remove the notification
    do (notification) -> $timeout ->
      index = $scope.flashNotifications.indexOf notification
      if index? then $scope.flashNotifications.splice index, 1
    , flashNotificationLifetime


exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
]
