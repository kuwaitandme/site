body = (document.getElementsByTagName "body")[0]
name = "[component:classified-interactive-list]"
scrollPosition = 0

exports = module.exports = ($location, $log, $root, $scope, $storage, $timeout,
Classifieds) ->
  $log.log name, "initializing"


  ###
    This function spawns the cards UI and hides the classified list.
  ###
  $scope.$on "classified-list:click", ($event, data) ->
    $log.log name, "spawning cards container"

    # Get the index of clicked element and assign it to the scope.
    $scope.index = data.$index

    # Display the cards container
    $scope.showCards = true
    $scope.hideList = true

    # Remember the scroll position and reset to 0 (for the classified cards)
    $root.bodyStyles.overflowY = "hidden"
    scrollPosition = body.scrollTop
    $timeout (-> body.scrollTop = 0), 500

    # Finally, with the help of HTML5's localStorage, we display a toast
    # notification describing about the use of arrow keys
    if not $storage.local "help:arrow-keys"
      $storage.local "help:arrow-keys", 1
      $scope.$emit "toast-notification", "Use arrow keys to navigate"


  ###
    This function listens for the close event sent by the cards container and
    hides it.
  ###
  $root.$on "classified-cards:close", ->
    $log.log name, "closing cards container"

    $root.bodyClasses["card-leaving"] = true
    $scope.hideList = false

    # Hide the cards container
    $timeout (-> $scope.showCards = false ), 250
    ###
      When closing the cards container, we reset the scroll position back to
      the value we saved it before. We also re-layout masonry because of the
      'display:none' that gets applied to the list (for performance on mobile)
      screws up the layout..
    ###
    $timeout (-> $root.bodyClasses["card-leaving"] = false ), 250
    $timeout (-> $scope.$broadcast "refresh" ), 200
    $timeout (-> body.scrollTop = scrollPosition ), 200
    $root.bodyStyles.overflowY = ""


exports.$inject = [
  "$location"
  "$log"
  "$rootScope"
  "$scope"
  "$storage"
  "$timeout"

  "models.classifieds"
]
