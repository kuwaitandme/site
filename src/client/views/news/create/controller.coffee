name = "[page:news]"


exports = module.exports = ($scope, $root, $stateParams, $log, $http, $location, Stories) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams
  $scope.$emit "page:loaded"

  $scope.story = {}

  # When requested to get the title, send the URL to our scrapper
  $scope.getTitle = ->
    $scope.formClasses = loading: $scope.formLoading = true
    $http.get "/api/news/scrape?u=#{$scope.story.url}"
    .success (info) -> $scope.story.title = info.title
    .finally -> $scope.formClasses = loading: $scope.formLoading = false

  $scope.submit = (data) ->
    Stories.create data
    .then -> $location.path "/news/recent"



exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "$http"
  "$location"
  "models.news.stories"
]
