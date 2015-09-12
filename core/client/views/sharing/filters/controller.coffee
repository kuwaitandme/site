Controller = ($scope, $root, $stateParams, $log, $http, $location, Stories) ->
  name = "[page:sharing]"
  $log.log name, "initializing"
  $log.debug name, "routeParams", $stateParams
  $scope.$emit "page:initialize"
  $scope.$emit "page:start"

  $scope.story = {}

  blockForm = -> $scope.formClasses = loading: $scope.formLoading = true
  unlockForm = -> $scope.formClasses = loading: $scope.formLoading = false

  # When requested to get the title, send the URL to our scrapper
  $scope.getTitle = ->
    blockForm()
    $http.get "/api/sharing/scrape?u=#{$scope.story.url}"
    .success (info) -> $scope.story.title = info.title
    .finally unlockForm

  $scope.submit = (data) ->
    blockForm()
    Stories.create data
    .then -> $location.path "/sharing/recent"
    .finally unlockForm


Controller.$inject = [
  "$scope"
  "$rootScope"
  "$stateParams"
  "$log"

  "$http"
  "$location"
  "@models/sharing/stories"
]


module.exports = Controller
