Controller = ($http, $location, $log, $scope, Notifications, Categories,
Stories) ->
  logger = $log.init Controller.tag
  logger.log "initializing"
  $scope.$emit "page:initialize", needLogin: true
  $scope.$emit "page:start"

  $scope.selectedCats = 0
  $scope.story = {}
  $scope.categories = Categories.getAll() or []
  cat.select = false for cat in $scope.categories


  blockForm = -> $scope.formClasses = loading: $scope.formLoading = true
  unlockForm = -> $scope.formClasses = loading: $scope.formLoading = false


  $scope.deselect = (cat) ->
    logger.log "de-selected category"
    logger.debug cat

    cat.select = false
    $scope.selectedCats--


  $scope.select = (cat) ->
    logger.log "selected category"
    logger.debug cat

    cat.select = true
    $scope.selectedCats++


  # When requested to get the title, send the URL to our scrapper
  $scope.getTitle = ->
    blockForm()
    $http.get "/api/sharing/scrape?u=#{$scope.story.url}"
    .success (info) -> $scope.story.title = info.title
    .finally unlockForm



  ###
    @param data {Object}
  ###
  $scope.submit = (data) ->
    blockForm()
    logger.log "submitting form"
    logger.debug data

    # Get the categories
    data.categories = []
    for category in $scope.categories
      if category.select is true then data.categories.push category.id

    headers = "x-recaptcha": $scope.form.gcaptcha

    # Send the request!
    Stories.create data, headers
    .success (story) ->
      Notifications.success "story_submit_success"
      $location.path "/story/#{story.slug}"
    .catch -> Notifications.success "story_submit_fail"
    .finally unlockForm


Controller.tag = "page:sharing"
Controller.$inject = [
  "$http"
  "$location"
  "$log"
  "$scope"
  "@notifications"
  "@models/sharing/categories"
  "@models/sharing/stories"
]
module.exports = Controller