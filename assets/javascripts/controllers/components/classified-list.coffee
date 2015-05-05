exports = module.exports = ($scope, $location, $element, $storage, $window,
  Classified) ->
  @name = "[component:classified-list]"
  console.log @name, "initializing"

  $el = angular.element document.querySelectorAll ".classified-list"
  masonry = new Masonry $el[0], transitionDuration: 0
  currentPage = 0
  $scope.classifieds = []
  loadingClassifieds = false

  $scope.childCategory  = $storage.get "childCategory"
  $scope.parentCategory = $storage.get "parentCategory"

  $scope.$watch (-> $el[0].childElementCount), =>
    for child in $el[0].children
      if not child.dataset.added
        child.dataset.added = true
        masonry.appended child
    masonry.layout()

  # This function toggles the classified dropdown
  $scope.toggleClassified = (classified) ->
    if not $scope.currentClassified?
      $scope.$broadcast "classified-changed", classified
      # history.pushState {}, classified.title, '/sdf'
      $scope.currentClassified = classified
    else
      $scope.currentClassified = undefined

  # This function loads more classifieds from the server.
  $scope.loadClassifieds = ->
    loadingClassifieds = true

    # Prepare the query fields
    parameters = page: currentPage++
    if $scope.parentCategory?
      parameters["parent_category"] = $scope.parentCategory.id
    if $scope.childCategory?
      parameters["child_category"] = $scope.childCategory.id

    # Run the query!
    Classified.query parameters, (error, classifieds) =>
      for classified in classifieds
        classified.showStatus = true
        classified.isUrgent = false
        classified.imageLoaded = -> masonry.layout()
        if classified.images and classified.images.length > 0
          classified.hasImages = true
        $scope.classifieds.push classified
      loadingClassifieds = false
  $scope.loadClassifieds()


  $scope.onScroll = ($event) =>
    html = document.documentElement
    body = document.body
    documentHeight = Math.max(
      body.clientHeight
      body.offsetHeight
      body.scrollHeight
      html.clientHeight
      html.offsetHeight
      html.scrollHeight
    )
    scrollPosition = body.scrollTop + $window.innerHeight
    if scrollPosition / documentHeight * 100 > 80 and not loadingClassifieds
      $scope.loadClassifieds()


exports.$inject = [
  "$scope"
  "$location"
  "$element"
  "$storage"
  "$window"
  "model.classified"
]