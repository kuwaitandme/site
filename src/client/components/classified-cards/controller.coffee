exports = module.exports = ($scope, $timeout, hotkeys) ->
  # This variable is used as a lock to prevent any animation collisions.
  isAnimating = false

  # Because the parent scope is responsible for displaying/hiding the cards
  # container, we emit an event for when the container has to be closed.
  $scope.close = ->
    console.log 'closing'
    $scope.$emit "classified-cards:close"

  # This function animates and brings the next classified in the Queue.
  $scope.next = ->
    # Prevent if we are already animating or we have reached the end of
    # classifieds
    if isAnimating or $scope.index is $scope.classifieds.length - 1 then return
    # Define the pre/post animation functions
    preAnimation = -> $scope.animationClasses = "show-next": true
    postAnimation = ->
      $scope.animationClasses = {}
      $scope.index += 1
      $scope.$broadcast "refresh"
      isAnimating = false
    # Animate!
    isAnimating = true
    preAnimation()
    $timeout postAnimation, 250

  # This function animates and brings the previous classified in the Queue.
  $scope.previous = ->
    # Prevent if we are already animating or we are at the first classified.
    if isAnimating or $scope.index is 0 then return
    # Define the pre/post animation functions
    preAnimation = -> $scope.animationClasses = "show-prev": true
    postAnimation = ->
      $scope.animationClasses = {}
      $scope.index -= 1
      $scope.$broadcast "refresh"
      isAnimating = false
    # Animate!
    isAnimating = true
    preAnimation()
    $timeout postAnimation, 250

  # Whenever the 'index' changes, we set two variables; 'indexOffset' and
  # 'indexLimit'. These two variables control how angular's limitTo (and
  # eventually ng-repeat) produces it's output.
  $scope.$watch 'index', ->
    $scope.indexOffset = Math.max $scope.index - 1 , 0
    $scope.indexLimit = if $scope.index is 0 then 2 else 3

  # This function calculate which classes to be set (along with ng-class='')
  # for the card with the given index. With a tiny algorithm, we can keep
  # track of the next, previous and current cards and animate them accordingly.
  #
  # It is somewhat hard-coded to assume that there will always be
  # three cards with unique classes of 'prev', 'current' and 'next'.
  $scope.calculateClass = (currentIndex) ->
    masterIndex = $scope.index
    if masterIndex is 0
      if currentIndex is 0 then return current: true
      if currentIndex > masterIndex then return next: true
    if masterIndex is $scope.classifieds.length - 1
      if currentIndex is 1 then return current: true
      if currentIndex < masterIndex then return prev: true
    if currentIndex is 0 then return prev: true
    if currentIndex is 2 then return next: true
    current: true

  # Now bind the navigation functions to the keyboard for convenience.
  hotkeys.bindTo $scope
  .add(combo: "left", callback: -> $scope.previous())
  .add(combo: "right", callback: -> $scope.next())
  .add(combo: "esc", callback: -> $scope.close())

exports.$inject = [
  "$scope"
  "$timeout"
  "hotkeys"
]
