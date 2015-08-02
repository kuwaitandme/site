name = "[page:news]"


exports = module.exports = ($scope, $root, $stateParams, $log, $http, $location, Stories) ->
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams
  $scope.$emit "page:loaded"

  $scope.story = {}

  blockForm = -> $scope.formClasses = loading: $scope.formLoading = true
  unlockForm = -> $scope.formClasses = loading: $scope.formLoading = false

  # When requested to get the title, send the URL to our scrapper
  $scope.getTitle = ->
    blockForm()
    $http.get "/api/news/scrape?u=#{$scope.story.url}"
    .success (info) -> $scope.story.title = info.title
    .finally unlockForm

  window.a = $scope

  $scope.submit = (data) ->
    blockForm()
    Stories.create data
    .then -> $location.path "/news/recent"
    .finally unlockForm



exports.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "$http"
  "$location"
  "models.news.stories"
]
