Controller = ($http, $log, $sce, $scope, Notifications, Stories) ->
  logger = $log.init Controller.tag
  logger.log "initializing"

  $scope.$emit "page:initialize"
  $scope.$emit "page:start"

  $scope.data = {}
  $scope.story = {}
  $scope.comment = ""



  _organizeComments = (comments) ->
    #! A recursive helper function to find a parent in the given array of
    #! comments.
    _findParent = (parentId, comments=[]) ->
      for comment in comments
        if comment.id is parentId then return comment
        parent = _findParent parentId, comment.children
        if parent? then return parent
      return null

    parents = []
    childComments = []

    #! First go through all the comments and see which are parent and child
    #! comments.
    for c in comments
      c.children = []
      if c.parent is null then parents.push c else childComments.push c

    #! Now create a upper bound loop.
    for i in [0..comments.length]
      flaws = 0

      #! For every child comment, find it's parent and recurssively reconstruct
      #! the parent-child tree.
      for childComment in childComments
        if childComment.fixed then continue

        #! So we try to find the parent here.
        parent = _findParent childComment.parent, parents

        #! If we found a parent, then we flag the child as fixed and add it to
        #! the parent.
        if parent?
          parent.children.push childComment
          childComment.fixed = true

        #! Else this child is flawed, (for the moment) let's see if we'll still
        #! find a parent for it once our entire loop is done.
        else flaws++

      #! If we have reached an iteration where there were no flaws, then that
      #! means all the children's parents have been found and attached properly.
      if flaws is 0 then break

    #! This shouldn't happen, but it means that there were a few children whose]
    #! parents we couldn't find.
    if flaws is not 0 then console.log 'fuck'
    return parents

  downloadPage = ->
    $http.pageAsJSON().success (data) ->
      $scope.story = data.story or {}
      $scope.description = $sce.trustAsHtml $scope.story.description

      $scope.comments = _organizeComments $scope.story.comments

      $scope.$emit "page:start"
      $scope.$emit "page:modify", title: $scope.story.title

  $scope.$on "refresh", downloadPage
  downloadPage()


  blockForm = -> $scope.formClasses = loading: $scope.formLoading = true
  unlockForm = -> $scope.formClasses = loading: $scope.formLoading = false


  $scope.submit = ->
    blockForm()

    id = $scope.story.id
    body = content: $scope.story.comment
    headers = "x-recaptcha": $scope.data.gcaptcha

    Stories.createComment(id, body, headers)
    .then ->
      logger.log "comment posted!"
      $scope.story.comment = ""

      $scope.$emit "refresh"
      Notifications.success "comment_posted"

    .catch (error) -> logger.error error
    .finally unlockForm


Controller.tag = "page:sharing/single"
Controller.$inject = [
  "$http"
  "$log"
  "$sce"
  "$scope"
  "@notifications"
  "@models/sharing/stories"
]
module.exports = Controller