Controller = ($location, $log, $sce, $scope, Notifications, Comments, Users) ->
  logger = $log.init Controller.tag
  logger.log "initializing"

  $scope.$watch "comment.content_markdown", (value) ->
    $scope.markdown = $sce.trustAsHtml $scope.comment.content

  $scope.data = {}
  $scope.path = $location.path()

  $scope.upvote = ->
    #! User needs to be logged in
    if not Users.isLoggedIn()
      Notifications.warn "login_needed"
      return $location.path "/login"

    #! Avoid upvoting if the comment has already been voting
    if $scope.hasVoted then return else $scope.hasVoted = true

    $scope.comment.score += 1
    Comments.upvote $scope.comment.id


  blockForm = -> $scope.formClasses = loading: $scope.formLoading = true
  unlockForm = -> $scope.formClasses = loading: $scope.formLoading = false

  $scope.submit = ->
    blockForm()

    id = $scope.comment.id
    body = content: $scope.data.child_comment
    headers = "x-recaptcha": $scope.data.gcaptcha

    Comments.createChildComment id, body, headers
    .then ->
      logger.log "comment posted!"
      $scope.story.comment = ""

      $scope.$emit "refresh"
      Notifications.success "comment_posted"
    .catch (error) -> logger.error error
    .finally unlockForm


Controller.tag = "component:sharing-comment"
Controller.$inject = [
  "$location"
  "$log"
  "$sce"
  "$scope"
  "@notifications"
  "@models/sharing/comments"
  "@models/users"
]
module.exports = Controller