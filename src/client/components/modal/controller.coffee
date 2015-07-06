name = "[component:modal]"


exports = module.exports = ($element, $scope, $root, $log, $timeout, $location,
hotkeys) ->
  $log.log name, "initializing"

  isModalOpen = false

  # Get the container where we will insert our content.
  contentDOM = angular.element $element[0].getElementsByClassName "content"


  # This event is triggered by the factory modal, when it is requesting the
  # controller to hide the modal. The controller is then responsible for letting
  # the factory know that it is done (animating) by firing the
  # "factory:modal:finish" event to allow the factory to start cleanup the
  # modal.
  $root.$on "component:modal:hide", ->
    $log.log name, "hiding"

    isModalOpen = false

    # Properly animate a fade-out effect
    contentDOM.removeClass "show"

    # TODO check for compatibilty
    if $location.search "modal-show" then history.back()

    $root.bodyClasses["modal-displayed"] = false

    $element.css "opacity", 0
    $timeout(500).then ->
      # After animation is done, we hide the element from the render queue
      $element.css "display", "none"

      # Then signal the factory, that we are done cleaning up here.
      $scope.$emit "factory:modal:finish"

      $location.search "modal-show", null


  # This function takes care of the show event from the factory modal
  $root.$on "component:modal:show", ->
    $log.log name, "showing"

    $location.search "modal-show", true

    # Properly animate a fade-in effect
    $element.css "display", "block"
    $element.css "opacity", 1
    $timeout(100).then ->
      contentDOM.addClass "show"
      $root.bodyClasses["modal-displayed"] = true
      isModalOpen = true


  $scope.$on "$locationChangeStart", ->
    if isModalOpen
      $root.bodyClasses["modal-displayed"] = false
      $scope.$emit "component:modal:hide"



  # Signal the factory modal to close it's current instance.
  $scope.closeModal = -> $scope.$emit "factory:modal:close"


  # Now bind the close function to the "ESC" for convenience.
  hotkeys.bindTo $scope
  .add
    callback: -> $scope.closeModal()
    combo: "esc"


exports.$inject = [
  "$element"
  "$scope"
  "$rootScope"
  "$log"
  "$timeout"
  "$location"
  "hotkeys"
]
