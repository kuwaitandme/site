name = "[component:header]"

exports = module.exports = ($scope, $root, $log, $timeout, Notifications) ->
  $log.log name, "initializing"

  # Use this to adjust how long the flash notifications stay on the header,
  # before they disappear
  flashNotificationLifetime = 5000
  # Allow upto 'X' unread notifications to be put in the sub-header
  maxUnreadNotifications = 3

  $scope.flashNotifications = []
  $scope.unreadNotifications = 12
  $scope.notifications = []

  # A click handler to display the sub header
  $scope.openHeader = -> $root.bodyClasses["show-subheader"] = true

  $scope.showAuth = -> $root.$broadcast "auth:show"


  # A click handler to hide the sub header. It also removes all unwanted unread
  # notifications.
  $scope.closeHeader = ->
    $root.bodyClasses["show-subheader"] = false
    count = 0
    for notification in $scope.notifications
      # Mark this notification as 'read'
      notification.hasRead = true
      # Remove all notifications that have exceeded our limit
      if ++count > maxUnreadNotifications
        notification.remove = true

  $root.$on "$stateChangeStart", $scope.closeHeader

  # This click handler is used to toggle (display/hide) the subheader.
  $scope.toggleHeader = ->
    headerIsOpened = $root.bodyClasses["show-subheader"]
    if headerIsOpened then $scope.closeHeader()
    else $scope.openHeader()

  # When a new notification gets added, run the below function to display it
  # properly
  onNotificationAdded = (notifications) ->
    $scope.unreadNotifications = 0
    for notification in notifications
      console.log notification, notification.hasRead()
      if not notification.hasRead() then $scope.unreadNotifications++

    json = do -> notification.get() for notification in notifications
    $scope.notifications = json

  # $scope.$watch "notifications", onNotificationAdded, true

  # # Add a listener for when notifications get marked as 'read' to update the
  # # counter
  # onNotificationRead = (notifications) ->
  #     # console.log name, notification
  # $scope.$watch "notifications", onNotificationRead, true

  $scope.$on "notifications:refresh", ->
    $scope.notification = Notifications.getAll()
    # console.log name, 's', $scope.notification
    onNotificationAdded $scope.notification
    # console.log name, Notifications.getAll()
  # # Listen for a notification event and add the new notification
  # $scope.$on "notification", (event, notification) ->
  #   $scope.flashNotifications.push notification
  #   lifetime = notification.timeout or flashNotificationLifetime
  #   # Set a timeout function to remove the notification
  #   # ((notifications) -> $timeout ->
  #   #   index = $scope.flashNotifications.indexOf notification
  #   #   if index? then $scope.flashNotifications.splice index, 1
  #   # , lifetime) notification
  #   # If it was a regular notification then add it to the header
  #   if not notification.flash then $scope.notifications.push notification


exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
  "models.notifications"
]
