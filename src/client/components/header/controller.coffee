name = "[component:header]"

# Allow upto 'X' unread notifications to be put in the sub-header
maxUnreadNotifications = 3

exports = module.exports = ($scope, $root, $log, $timeout, $location,
Notifications) ->
  $log.log name, "initializing"


  $root.$on "$viewContentLoaded", ->
    try $scope.route = $location.path().split("/")[1] or ""
    catch e then $scope.route = ""
    try $scope.subroute = $location.path().split("/")[2] or ""
    catch e then $scope.subroute = ""
    reselectColor()


  reselectColor = ->
    switch $scope.route
      when "contribute" then $scope.mainColor = "#FAA617"
      when "forums" then $scope.mainColor = "#2461B2"
      when "meetups" then $scope.mainColor = "#F60"
      when "news" then $scope.mainColor = "#009F5E"
      when "sharing" then $scope.mainColor = "#CB202E"
      when "stories" then $scope.mainColor = "#A0C9CC"
      else $scope.mainColor = "#222"

    if not $scope.showMenuHeader then $scope.mainColor = "#FFF"

  $scope.notifications = []
  $scope.unreadNotifications = 0

  # A click handler to display the sub header
  $scope.openHeader = ->
    $root.bodyClasses["show-subheader"] = $scope.showMenuHeader = true
    reselectColor()


  # A click handler to hide the sub header.
  $scope.closeHeader = ->
    $root.bodyClasses["show-subheader"] = $scope.showMenuHeader = false
    reselectColor()


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
