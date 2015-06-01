exports = module.exports = ($scope, $rootScope, $log) ->
  @name = "[component:loader]"
  $log.log @name, "initializing"

  # Listen for a notification event and add the new notification
  $scope.$on "notification", (notification) ->
    $scope.flashNotifications.push notification


exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
]
