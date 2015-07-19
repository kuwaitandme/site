name = "[component:header]"

# Allow upto 'X' unread notifications to be put in the sub-header
maxUnreadNotifications = 3

exports = module.exports = ($scope, $root, $log, $timeout, $location,
Stories) ->
  $log.log name, "initializing"

  $scope.hasVoted = false

  $scope.upvote = ->
    if $scope.hasVoted then return
    $scope.hasVoted = true
    $scope.story.score += 1
    Stories.upvote $scope.story.id

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

  "models.news.stories"
]
