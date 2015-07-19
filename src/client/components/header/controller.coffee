name = "[component:header]"

# Allow upto 'X' unread notifications to be put in the sub-header
maxUnreadNotifications = 3

exports = module.exports = ($scope, $root, $log, $timeout, $location,
Notifications) ->
  $log.log name, "initializing"

  $scope.route = "news"

  $scope.notifications = []
  $scope.unreadNotifications = 0

  # A click handler to display the sub header
  $scope.openHeader = ->
    $root.bodyClasses["show-subheader"] = $scope.showMenuHeader = true


  # A click handler to hide the sub header.
  $scope.closeHeader = ->
    $root.bodyClasses["show-subheader"] = $scope.showMenuHeader = false


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


  $scope.headerLogoClick = ->
    if not $root.bodyClasses["show-header-backbutton"] then $location.path "/"
    else history.back()


exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
  "$location"

  "models.notifications"
]
