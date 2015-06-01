exports = module.exports = ($location, $log, $root, $scope, $timeout, $window,
Classifieds) ->
  @name = "[component:classified-list]"
  $log.log @name, "initializing"

  # Initialize masonry
  classifedList = (angular.element document.querySelectorAll ".classified-list")[0]
  masonry = new Masonry classifedList

  # Initialize some variables
  currentPage = 1
  loadingClassifieds = false
  scrollPosition = 0
  body = (document.getElementsByTagName "body")[0]
  $scope.queryFinished ?= false
  $scope.redirectToEditPage ?= false
  $scope.classifiedStyles ?= {}
  $root.bodyStyles ?= {}
  $scope.showClassifiedContainer = false

  # setup the finish and empty classifieds message
  $scope.finishMessage ?= (->
    texts = [
      "Damn, there are no more classifieds!"
      "Mayday! we're all out of classifieds!"
      "Woops! that's all we got!"
      "Wowie! that seems to be all we have!"
    ]
    texts[Math.floor Math.random() * texts.length])()
  $scope.emptyMessage ?= $scope.finishMessage


  # Listen to any changes to the classified list. If more classified have been
  # added, the added them to the DOM and reload masonry.
  $scope.$watch (-> classifedList.childElementCount), =>
    if classifedList.children.length > 0
      newElements = []
      for child in classifedList.children
        # We use the 'data-added' attr to decide if the element has been added
        # or not (to masonry)
        if not child.dataset.added
          child.dataset.added = true
          newElements.push child
      masonry.appended newElements
      # Reload masonry and give a timeout of 10ms for the browser to properly
      # render the elements and set the heights.
      $timeout (-> masonry.layout()), 10


  # This function toggles the classified dropdown
  $scope.toggleClassified = (classified) ->
    # _animateIn = ()
    if $scope.redirectToEditPage
      return $location.path "/classified/edit/#{classified.id}"

    if not $scope.showClassifiedContainer
      $scope.$broadcast "classified-changed", classified
      $root.bodyStyles.overflowY = "hidden"
      scrollPosition = body.scrollTop
      body.scrollTop = 0

      $scope.classified = classified
      $scope.showClassifiedContainer = true

      $scope.classifiedStyles =
        animateBackground: true
        enterAnimation: true
      $timeout  ->
        $scope.$apply -> $scope.classifiedStyles.animateClassified = true
      , 200
    else
      $scope.classifiedStyles = {}
      $scope.classifiedStyles.leaveAnimation = true
      $scope.classifiedStyles.animateClassified = true
      $timeout  ->
        $scope.$apply -> $scope.classifiedStyles.animateBackground = true
        $timeout  ->
          $scope.$apply ->
            $scope.classifiedStyles.animationDone = true
            $scope.showClassifiedContainer = false
        , 500
      , 200
      $timeout (-> body.scrollTop = scrollPosition), 50
      $root.bodyStyles.overflowY = ""


  # This function loads more classifieds from the server.
  $scope.classifieds = []
  $scope.loadClassifieds = =>
    $log.log @name, "loading more classifieds"
    $log.debug @name, "page:", currentPage
    parameters = page: currentPage++
    # Extend the $scope.query object to our query parameters. This way we can
    # have parent controllers define the $scope.query according to their needs
    # and can then get used here (due to angular scope inheritance).
    angular.extend parameters, ($scope.query or {})
    # Run the query!
    Classifieds.query parameters, (error, classifieds) =>
      if error then $log.error error
      if classifieds.length == 0 then $scope.queryFinished = true
      $log.log @name, "finished loading classifieds"
      $log.debug @name, "loaded #{classifieds.length} classified(s)"
      # For each classified attach the imageLoader and add it to the DOM
      # (manually that is).
      for classified in classifieds
        if $scope.redirectToEditPage
          classified.link = "classified/edit/#{classified.id}"
        classified.imageLoaded = -> masonry.layout()
        $scope.classifieds.push classified
      loadingClassifieds = false
  $scope.loadClassifieds()


  # Setup the onScroll function.
  $scope.onScroll = ($event) =>
    if $scope.queryFinished or loadingClassifieds then return
    # Setup some defaults
    body = document.body
    html = document.documentElement
    documentHeight = Math.max(
      body.clientHeight, body.offsetHeight, body.scrollHeight
      html.clientHeight, html.offsetHeight, html.scrollHeight
    )
    scrollPosition = body.scrollTop + $window.innerHeight
    # If we have passed 80% down the window, then load more classifieds
    if scrollPosition / documentHeight * 100 > 80
      loadingClassifieds = true
      $scope.loadClassifieds()


exports.$inject = [
  "$location"
  "$log"
  "$rootScope"
  "$scope"
  "$timeout"
  "$window"

  "models.classifieds"
]