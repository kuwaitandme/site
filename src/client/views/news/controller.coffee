name = "[page:news]"


exports = module.exports = ($scope, $root, $stateParams, $log, Categories, News, $sce) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams


  $scope.categories = Categories.getAll()
  News.top().success (stories) ->
    stories = stories.concat stories
    stories = stories.concat stories
    stories = stories.concat stories
    # stories = stories.concat stories
    # stories = stories.concat stories
    for story in stories then story.score = Math.floor Math.random() * 100
    $scope.stories = stories
    $scope.$emit "page:loaded"


exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "models.news.categories"
  "models.news.stories"
  "$sce"
]
