name = "[page:news]"


exports = module.exports = ($scope, $root, $stateParams, $log, $http, $location) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams


  $http.get $location.url()
  .success (data) ->
    stories = data.concat data
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

  "$http"
  "$location"
]
