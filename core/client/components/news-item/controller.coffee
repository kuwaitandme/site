Controller = ($scope, $log, Stories, Categories, Settings) ->
  logger = $log.init Controller.tag
  logger.log "initializing"

  $scope.settings = {}

  $scope.getCategory = (id) -> Categories.findById id

  $scope.$watch "story", (story={}) ->
    categories = []

    for categoryPair in (story.categories or [])
      categories.push Categories.findById categoryPair.category

    $scope.story.parsedCategories = categories


  onSettingsUpdate = ->
    $scope.settings = Settings.getAll()
    $scope.openNewTab = Settings.get "storyInNewTab"


  $scope.$on "settings:change", onSettingsUpdate
  onSettingsUpdate()

  # $scope.categories = Categories.getAll()
  $scope.hasVoted = false
  $scope.upvote = ->
    if $scope.hasVoted then return
    $scope.story.score += 1
    $scope.hasVoted = true
    Stories.upvote $scope.story.id


Controller.tag = "component:sharing-item"
Controller.$inject = [
  "$scope"
  "$log"
  "@models/sharing/stories"
  "@models/sharing/categories"
  "@settings"
]
module.exports = Controller