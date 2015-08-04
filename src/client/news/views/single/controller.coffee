exports = module.exports = ($scope, $log, $notifications, $http, $sce, Stories) ->
  name = "[page:news/single]"
  $log.log name, "initializing"
  $scope.$emit "page:loaded"

  $scope.story = {}

  $http.pageAsJSON().success (data) ->
    $scope.story = data.story
    $scope.description = $sce.trustAsHtml $scope.story.description
    $scope.$emit "page:loaded"

  blockForm = -> $scope.formClasses = loading: $scope.formLoading = true
  unlockForm = -> $scope.formClasses = loading: $scope.formLoading = false

  $scope.submit = (data) ->
    blockForm()
    Stories.createComment $scope.story.id, content: data
    .then ->
      $notifications.success "Your comment has been posted successfully! Reload this page"
      location.reload() # avoid using global fn.
    .finally unlockForm




exports.$inject = [
  "$scope"
  "$log"
  "$notifications"

  "$http"
  "$sce"
  "models.news.stories"
]
