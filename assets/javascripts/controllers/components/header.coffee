exports = module.exports = ($scope, $rootScope, console, setTimeout) ->
  @name = "[component:header]"
  console.log @name, "initializing"

  # Use this to adjust how long the flash notifications stay on the header,
  # before they disappear
  flashNotificationLifetime = 3000

  $scope.flashNotifications = []
  $rootScope.bodyClasses ?= {}

  # A click handler to display the sub header
  $scope.openHeader = -> $rootScope.bodyClasses["show-subheader"] = false


  # A click handler to hide the sub header. It also marks all the notifications
  # as read.
  $scope.closeHeader = -> $rootScope.bodyClasses["show-subheader"] = false


  # This click handler is used to toggle (display/hide) the subheader.
  $scope.toggleHeader = ->
    headerIsOpened = $rootScope.bodyClasses["show-subheader"]
    if headerIsOpened then $scope.closeHeader()
    else $scope.openHeader()


  # When a new notification gets added, run the below function to display it
  # properly
  onFlashNotificationsChange = (notifications)
    # For every notification check if the timeout function has been called on
    # it already.
    for notification in notifications
      if not notification.timeoutset
        notification.timeoutset = true
        # Set a timeout function to remove the notification
        ((notifications) -> setTimeout ->
          index = $scope.flashNotifications.indexOf notification
          if index? then $scope.flashNotifications.splice index, 1
        , flashNotificationLifetime) notification
  $scope.$watch "flashNotifications", onFlashNotificationsChange, true


  # This function gets called when the close button in the flash notifications
  # has been pressed.
  $scope.removeNotifications = (array, index) ->
    $scope.flashNotifications.splice index, 1


  # Listen for a notification event and add the new notification
  $scope.$on "notification", (notification) ->
    $scope.flashNotifications.push notification


exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
]