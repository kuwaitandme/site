exports = module.exports = ($scope, $root, console, setTimeout) ->
  @name = "[component:header]"
  console.log @name, "initializing"

  # Use this to adjust how long the flash notifications stay on the header,
  # before they disappear
  flashNotificationLifetime = 3000
  # Allow upto 'X' unread notifications to be put in the sub-header
  maxUnreadNotifications = 3

  $scope.flashNotifications = []
  $scope.unreadNotifications = 12
  $scope.notifications = []
  $root.bodyClasses ?= {}


  # A click handler to display the sub header
  $scope.openHeader = -> $root.bodyClasses["show-subheader"] = true


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


  # This click handler is used to toggle (display/hide) the subheader.
  $scope.toggleHeader = ->
    headerIsOpened = $root.bodyClasses["show-subheader"]
    if headerIsOpened then $scope.closeHeader()
    else $scope.openHeader()


  # When a new notification gets added, run the below function to display it
  # properly
  onNotificationAdded = (notifications) ->
    # For every notification check if it has been flashed to the user or not.
    # if it has, then flash it and then add it to the sub header.
    for notification in notifications
      if not notification.hasFlashedToUser
        notification.hasFlashedToUser = true
        $scope.flashNotifications.push notification
        # Set a timeout function to remove the notification
        ((notifications) -> setTimeout ->
          index = $scope.flashNotifications.indexOf notification
          if index? then $scope.flashNotifications.splice index, 1
        , flashNotificationLifetime) notification
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
    console.log notification
    $scope.notifications.push notification

exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
]