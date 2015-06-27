name = "[component:header]"

# Allow upto 'X' unread notifications to be put in the sub-header
maxUnreadNotifications = 3

exports = module.exports = ($scope, $root, $log, $timeout, Notifications) ->
  $log.log name, "initializing"

  $scope.notifications = []
  $scope.unreadNotifications = 0

  # A click handler to display the sub header
  $scope.openHeader = -> $root.bodyClasses["show-subheader"] = true

  # This function sends an event which gets picked by the auth component and
  # shows the auth modal..
  $scope.showAuth = -> $root.$broadcast "component:auth:show"


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


  # Add a listener for when notifications get marked as 'read' to update the DB.
  $scope.onNotificationRead = -> Notifications.signalRead()


  # When a new notification gets added, run the below function to display it
  # properly
  readNotification = ->
    $scope.unreadNotifications = 0
    notifications = Notifications.getAll()

    # Now calculate how many unread notifications exist.
    for notification in notifications
      if not notification.hasRead() then $scope.unreadNotifications++

    # Retrieve the JSON of the classifieds and update the DOM
    json = do -> notification.get() for notification in notifications
    $scope.notifications = json

  # Attach this function to the refresh event and run it once (because the header
  # can initialize after the notifications have been downloaded).
  $scope.$on "notifications:refresh", readNotification
  readNotification()


exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"

  "models.notifications"
]
