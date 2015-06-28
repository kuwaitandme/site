exports = module.exports = ($element, $log, $scope, $timeout, Classifieds,
Modal) ->
  @name = "[component:classified-single]"
  $log.log @name, "initializing"

  cl = $scope.classified
  cl.show = true

  # Initialize masonry
  $scope.$watch "classified", -> $timeout ->
    imageContainer = $element[0].querySelector "ul.gallery"
    cl.masonry = new Masonry imageContainer, gutter: 0, transitionDuration: 0
  , 10

  # Reload masonry on the refresh event
  $scope.$on "refresh", -> if cl.masonry? then $timeout (-> cl.masonry.layout())

  # When images are loaded, re-layout masonry
  $scope.update = -> if cl.masonry? then cl.masonry.layout()


  $scope.showContactModal = ->
    ContactModal = Modal.showModal
      controller: require "./controller.modal"
      templateUrl: "components/classifieds/single/template.modal"
    .then (modal) -> modal.scope.id = cl.id



exports.$inject = [
  "$element"
  "$log"
  "$scope"
  "$timeout"

  "models.classifieds"
  "modal"
]
