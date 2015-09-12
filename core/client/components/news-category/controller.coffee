Controller = ($scope, $log, $sce) ->
  logger = $log.init Controller.tag
  logger.log "initializing"

  $scope.$watch "comment.content_markdown", (value) ->
    $scope.markdown = $sce.trustAsHtml $scope.comment.content

  $scope.upvote = ->
    if $scope.hasVoted then return
    $scope.hasVoted = true
    $scope.story.score += 1
    Stories.upvote $scope.story.id


Controller.tag = "component:sharing-category"
Controller.$inject = [
  "$scope"
  "$log"
  "$sce"
]
module.exports = Controller