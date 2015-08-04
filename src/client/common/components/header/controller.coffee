name = "[component:header]"

# Allow upto 'X' unread notifications to be put in the sub-header
maxUnreadNotifications = 3

exports = module.exports = ($scope, $root, $log, $timeout, $location,
Notifications) ->
  $log.log name, "initializing"

  $scope.activeLink = null

  $root.$on "$viewContentLoaded", ->
    try $scope.route = $location.path().split("/")[1] or ""
    catch e then $scope.route = ""
    reselectColor()


  $scope.onMainLinkHover = (link) ->
    if $scope.activeLink? then $scope.activeLink.isActive = false
    if not link.children? then return $scope.showSubMenu = false
    link.isActive = true
    $scope.showSubMenu = true
    $scope.mainBorderColor = link.color
    $scope.activeLink = link


  $scope.onCoverHover = ->
    $scope.showSubMenu = false
    reselectColor()
    if $scope.activeLink? then $scope.activeLink.isActive = false


  onHeaderChange = ->
    setActiveLinks()
    reselectColor()

  onHeaderClose = ->
    $scope.showMenuHeader = false
    $scope.showSubMenu = false
    $scope.$broadcast "hamburger:close"
    if $scope.activeLink? then $scope.activeLink.isActive = false
    onHeaderChange()

  onHeaderOpen = ->
    $scope.$broadcast "hamburger:open"
    onHeaderChange()


  $scope.showSubMenu = false
  $scope.links = require "./links.json"

  setActiveLinks = ->
    url = $location.url()
    evaluate = (l) -> l.isActive = url.indexOf(l.url) is 0 and l.url != "/"
    for link in $scope.links
      evaluate link
      evaluate childLink for childLink in link.children or []
      if link.isActive then $scope.currentPageLink = link


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
    $scope.mainBorderColor = $scope.mainColor

  $scope.notifications = []
  $scope.unreadNotifications = 0

  # A click handler to display the sub header
  $scope.openHeader = ->
    $scope.showMenuHeader = true
    onHeaderOpen()


  # A click handler to hide the sub header.
  $scope.closeHeader = -> onHeaderClose()


  $root.$on "$stateChangeStart", $scope.closeHeader
  $scope.$watch "showMenuHeader", (v) -> $root.bodyClasses["show-header"] = v
  $scope.$watch "showSubMenu", (v) -> $root.bodyClasses["show-subheader"] = v


  # This click handler is used to toggle (display/hide) the subheader.
  $scope.toggleHeader = ->
    if $scope.showMenuHeader then $scope.closeHeader()
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
  # readNotification()


  $scope.headerLogoClick = ->
    if not $root.bodyClasses["show-header-backbutton"] then $location.path "/"
    else history.back()


exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
  "$location"

  # "models.notifications"
]
