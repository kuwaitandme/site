exports = module.exports = ($element, $location, $log, $root, $scope, $timeout,
$window, Classifieds) ->
  name = "[component:classified-list]"
  $log.log name, "initializing"

  # Setup some defaults..
  body = (document.getElementsByTagName "body")[0]
  currentPage = 1
  scrollPosition = 0

  # Initialize masonry
  classifedList = $element[0].querySelector ".classified-list-container"
  masonry = new Masonry classifedList, transitionDuration: 0


  # This function is responsible for either displaying the cards container or
  # redirecting to the edit page
  $scope.onClassifiedClick = ($index, classified) ->
    $scope.$emit "classified-list:click",
      $index: $index
      classified: classified


  # During a refresh event, re-layout masonry.
  $scope.$on "refresh", -> $timeout (-> masonry.layout() ), 100


  # Setup the 'finish' and 'empty' classifieds message
  $scope.finishMessage ?= (->
    texts = [
      "Oh man, there are no more classifieds!"
      "Mayday! we're all out of classifieds!"
      "Woops! that's all we got!"
      "Wowie! that seems to be all we have!"
    ]
    texts[Math.floor Math.random() * texts.length])()
  $scope.emptyMessage ?= $scope.finishMessage


  # Listen to any changes to the classified list. If more classified have been
  # added, the added them to masonry and relayout!
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
    $log.log name, "loading more classifieds"
    $log.debug name, "page:", currentPage
    parameters = page: currentPage++

    # Extend the $scope.query object to our query parameters. This way we can
    # have parent controllers define the $scope.query according to their needs
    # and can then get used here (due to angular scope inheritance).
    #
    # TODO, move this ngModel..
    angular.extend parameters, ($scope.query or {})

    # Finally!, run the query..
    Classifieds.query parameters
    .then (response) ->
      $log.log name, "finished loading classifieds"
      $log.debug name, "loaded #{response.data.length} classified(s)"
      classifieds = response.data or []
      if classifieds.length != 0
        # For each classified attach the imageLoader and add it to the DOM
        # (manually that is).
        for classified in classifieds
          classified.imageLoaded = -> masonry.layout()
          $scope.classifieds.push classified
      else $scope.queryFinished = true

      $scope.loadingClassifieds = false
    .catch (response) -> $log.error response

  # Load the first batch of classifieds
  $scope.loadClassifieds()

  # Reload the classified after a few seconds to fix the bug when there aren't
  # enough classifieds to trigger the scroll
  setTimeout (-> $scope.loadClassifieds()), 5000


  # Setup the onScroll function.
  $scope.onScroll = ($event) ->
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
