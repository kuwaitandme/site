exports = module.exports = ($element, $location, $log, $root, $scope, $timeout,
$window, Classifieds) ->
  @name = "[component:classified-list]"
  $log.log @name, "initializing"
  # Initialize some variables
  currentPage = 1
  body = (document.getElementsByTagName "body")[0]
  $scope.loadingClassifieds = false
  scrollPosition = 0
  $scope.queryFinished ?= false
  $scope.redirectToEditPage ?= false
  $scope.classifiedStyles ?= {}
  $root.bodyStyles ?= {}
  $scope.showClassifiedContainer = false

  # Initialize masonry
  classifedList = $element[0].querySelector ".classified-list"
  masonry = new Masonry classifedList, transitionDuration: 0

  # This function is responsible for either displaying the cards container or
  # redirecting to the edit page
  $scope.onClassifiedClick = ($index, classified) ->
    if $scope.redirectToEditPage
      return $location.path "/classified/edit/#{classified.id}"
    # Get the index of clicked element and assign it to the scope.
    $scope.index = $index
    # Display the cards container
    $scope.showCards = true
    # Remember the scroll position and reset to 0 (for the classified cards)
    $root.bodyStyles.overflowY = "hidden"
    scrollPosition = body.scrollTop
    $timeout (-> body.scrollTop = 0), 500

  # This function listens for the close event sent by the cards container and
  # hides it.
  $root.$on "classified-cards:close", ->
    $root.bodyClasses["card-leaving"] = true
    $scope.hideList = false
    # Hide the cards container
    $timeout (-> $scope.showCards = false ), 250
    # When closing the cards container, we reset the scroll position back to
    # the value we saved it before. We also re-layout masonry because of the
    # 'display:none' that gets applied to the list (for performance on mobile)
    # screws up the layout..
    $timeout (-> masonry.layout() ), 100
    $timeout (-> body.scrollTop = scrollPosition ), 200
    $timeout (-> $root.bodyClasses["card-leaving"] = false ), 250
    $root.bodyStyles.overflowY = ""

  $scope.$watch $scope.showCards, ->
    if $scope.showCards then $scope.hideList = true

  # Setup the 'finish' and 'empty' classifieds message
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
  $scope.$watch (-> classifedList.childElementCount), ->
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
        classified.imageLoaded = -> masonry.layout()
        $scope.classifieds.push classified
      $scope.loadingClassifieds = false
  $scope.loadClassifieds()
  # Reload the classified after a second to fix the bug when there aren't
  # enough classifieds to trigger the scroll
  setTimeout (-> $scope.loadClassifieds()), 1000

  # Setup the onScroll function.
  $scope.onScroll = ($event) ->
    if $scope.queryFinished or $scope.loadingClassifieds then return
    # Setup some defaults
    body = document.body
    html = document.documentElement
    documentHeight = Math.max(
      body.clientHeight, body.offsetHeight, body.scrollHeight
      html.clientHeight, html.offsetHeight, html.scrollHeight
    )
    scroll = body.scrollTop + $window.innerHeight
    # If we have passed 80% down the window, then load more classifieds
    if scroll / documentHeight * 100 > 80
      $scope.loadingClassifieds = true
      $scope.loadClassifieds()


exports.$inject = [
  "$element"
  "$location"
  "$log"
  "$rootScope"
  "$scope"
  "$timeout"
  "$window"

  "models.classifieds"
]
