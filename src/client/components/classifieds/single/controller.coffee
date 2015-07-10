name = "[component:classified-single]"


exports = module.exports = ($element, $log, $scope, $timeout, Classifieds,
Users, Modal) ->
  $log.log name, "initializing"

  cl = $scope.classified
  cl.show = true

  $scope.$watch "classified", ->
    # Fetch the owner of the classified!
    Users.get(cl.owner).then (response) -> $scope.owner = response.data

    # Initialize masonry. Give 10ms so that the DOM can be rendered before
    # masonry works it magic..
    $timeout(10).then ->
      imageContainer = $element[0].querySelector "ul.gallery"
      cl.masonry = new Masonry imageContainer, gutter: 0, transitionDuration: 0

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
  "models.users"
  "modal"
]
