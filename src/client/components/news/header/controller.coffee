name = "[component:header]"

# Allow upto 'X' unread notifications to be put in the sub-header
maxUnreadNotifications = 3

exports = module.exports = ($scope, $root, $log, $timeout, $location,
Notifications) ->
  $log.log name, "initializing"


  setRoute = ->
    try $scope.route = $location.path().split("/")[2] or ""
    catch e then $scope.route = ""
    console.log  $scope.route
  $root.$on "$viewContentLoaded", setRoute
  setRoute()



exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
  "$location"

  "models.notifications"
]
