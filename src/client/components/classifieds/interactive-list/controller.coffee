exports = module.exports = ($element, $location, $log, $root, $scope, $timeout,
$window, Classifieds) ->
  @name = "[component:classified-interactive-list]"
  $log.log @name, "initializing"
  body = (document.getElementsByTagName "body")[0]
  scrollPosition = 0

  # This function spawns the cards UI and hides the classified list.
  $scope.$on "classified-list:click", ($event, data) ->
    # Get the index of clicked element and assign it to the scope.
    $scope.index = data.$index
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
    $timeout (-> $scope.$broadcast "refresh" ), 200
    $timeout (-> body.scrollTop = scrollPosition ), 200
    $timeout (-> $root.bodyClasses["card-leaving"] = false ), 250
    $root.bodyStyles.overflowY = ""

  $scope.$watch "showCards", ->
    if $scope.showCards then $scope.hideList = true


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
