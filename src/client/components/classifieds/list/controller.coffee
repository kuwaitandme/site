exports = module.exports = ($element, $location, $log, $root, $scope, $timeout,
$window, Classifieds) ->
  name = "[component:classified-list]"
  $log.log name, "initializing"

  # Setup some defaults..
  body = (document.getElementsByTagName "body")[0]
  currentPage = 1
  scrollPosition = 0
  classifedList = null
  masonry = null

  options = {}
  query = {}

  initializeQuery = ->
    console.log name, "re-initializing"
    query = $scope.query
    currentPage = 1

    # (Re-)Initialize masonry
    classifedList = $element[0].querySelector ".classified-list-container"
    masonry = new Masonry classifedList, transitionDuration: 0

    # Clear the DOM and reset masonry
    masonry.remove classifedList.childNodes
    $scope.classifieds = []

    $scope.urlTransform = options.urlTransformer or (index) ->
      "/#{$scope.classifieds[index].slug}"

    # Load the first batch of classifieds
    $scope.loadClassifieds()
    .then -> console.debug name, "initialized"
  $scope.$watch "query", initializeQuery


  # During a refresh event, re-layout masonry.
  $scope.$on "refresh", -> $timeout (-> masonry.layout() ), 100

  initializeOptions = ->
    options = $scope.options

    # Setup the 'finish' and 'empty' classifieds message
    $scope.finishMessage = options.finishMessage or do ->
      texts = [
        "Oh man, there are no more classifieds!"
        "Mayday! we're all out of classifieds!"
        "Woops! that's all we got!"
        "Wowie! that seems to be all we have!"
      ]
      texts[Math.floor Math.random() * texts.length]
    $scope.emptyMessage = options.emptyMessage or $scope.finishMessage
  $scope.$watch "options", initializeOptions


  # Listen to any changes to the classified list. If more classified have been
  # added, the added them to masonry and relayout!
  $scope.$watch (-> classifedList.childElementCount), ->
    if classifedList? and classifedList.children.length > 0
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
  $scope.loadClassifieds = ->
    $log.log name, "loading more classifieds"
    $log.debug name, "page:", currentPage
    parameters = page: currentPage++

    # Extend the $scope.query object to our query parameters. This way we can
    # have parent controllers define the $scope.query according to their needs
    # and can then get used here (due to angular scope inheritance).
    #
    # TODO, move this ngModel..
    angular.extend parameters, (query or {})

    # Finally!, run the query..
    Classifieds.query parameters
    .then (response) ->
      $log.log name, "finished loading classifieds"
      $log.debug name, "loaded #{response.data.length} classified(s)"

      classifieds = response.data or []

      # For each classified attach the imageLoader and add it to the DOM
      # (individually).
      for classified in classifieds
        if classified.id != $scope.query.exclude
          classified.imageLoaded = -> masonry.layout()
          $scope.classifieds.push classified


      if $scope.classifieds.length is 0 then $scope.queryFinished = true

      $scope.loadingClassifieds = false
    .catch (response) -> $log.error response


  # Setup the onScroll function.
  $scope.onScroll = ($event) ->
    # If the user has disabled scrolling functions then return
    if options.loadSinglePage then return

    # If there is a query running then return..
    if $scope.queryFinished or $scope.loadingClassifieds then return

    # Setup some defaults
    body = document.body
    html = document.documentElement

    # Calculate the scroll position
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
