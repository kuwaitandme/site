exports = module.exports = ($scope, $window, $rootScope, console, Classified) ->
  @name = "[component:classified-list]"
  console.log @name, "initializing"

  # Initialize masonry
  classifedList = (angular.element document.querySelectorAll ".classified-list")[0]
  masonry = new Masonry classifedList, transitionDuration: 0

  # Initialize some variables
  currentPage = 1
  loadingClassifieds = false
  scrollPosition = 0
  body = document.getElementsByTagName("body")[0]

  # Initialize DOM elements
  $scope.queryFinished = false
  $scope.finishMessage = (->
    texts = [
      "Damn, there are no more classifieds!"
      "Mayday! we're all out of classifieds!"
      "Woops! that's all we got!"
      "Wowie! that seems to be all we have!"
    ]
    texts[Math.floor Math.random() * texts.length])()


  $scope.$watch (-> classifedList.childElementCount), =>
    if classifedList.children.length > 0
      newElements = []
      for child in classifedList.children
        if not child.dataset.added
          child.dataset.added = true
          newElements.push child
      masonry.appended newElements.reverse()
      masonry.layout()


  # This function toggles the classified dropdown
  $scope.toggleClassified = (classified) ->
    $rootScope.bodyStyles = $rootScope.bodyStyles or {}
    console.log scrollPosition, body.scrollTop

    if not $scope.classified?
      $scope.$broadcast "classified-changed", classified
      $rootScope.bodyStyles.overflowY = "hidden"
      $scope.classified = classified
      scrollPosition = body.scrollTop
      body.scrollTop = 0
    else
      $scope.classified = undefined
      setTimeout (-> body.scrollTop = scrollPosition), 50
      $rootScope.bodyStyles.overflowY = ""


  # This function loads more classifieds from the server.
  $scope.classifieds = []
  $scope.loadClassifieds = =>
    console.log @name, "loading more classifieds"
    console.debug @name, "page:", currentPage

    # Prepare the query fields
    parameters = page: currentPage++
    if $scope.parentCategory?
      parameters["parent_category"] = $scope.parentCategory.id
    if $scope.childCategory?
      parameters["child_category"] = $scope.childCategory.id

    # Run the query!
    Classified.query parameters, (error, classifieds) =>
      if error then console.error error
      if classifieds.length == 0 then $scope.queryFinished = true
      console.log @name, "finished loading classifieds"
      console.debug @name, "loaded #{classifieds.length} classified(s)"
      # For each classified attach the imageLoader
      for classified in classifieds
        classified.showStatus = true
        classified.isUrgent = false
        classified.imageLoaded = -> masonry.layout()
        for image in (classified.images or [])
          if image.main? and image.main
            classified.mainImage = image
            break
        $scope.classifieds.push classified
      loadingClassifieds = false
  $scope.loadClassifieds()


  $scope.onScroll = ($event) =>
    if $scope.queryFinished or loadingClassifieds then return

    # Setup some defaults
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

    # If we have passed 80% down the window, then load more classifieds
    if scrollPosition / documentHeight * 100 > 80
      loadingClassifieds = true
      $scope.loadClassifieds()


exports.$inject = [
  "$scope"
  "$window"
  "$rootScope"
  "$log"
  "model.classified"
]