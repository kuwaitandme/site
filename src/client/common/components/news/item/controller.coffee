name = "[component:news-item]"


exports = module.exports = ($scope, $root, $log, $timeout, $location,
Stories) ->
  $log.log name, "initializing"

  $scope.hasVoted = false

  $scope.upvote = ->
    if $scope.hasVoted then return
    $scope.hasVoted = true
    $scope.story.score += 1
    Stories.upvote $scope.story.id


exports.$inject = [
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
  "$location"

  "models.news.stories"
]
