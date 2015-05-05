exports = module.exports = ($scope, $location, $element, classified) ->
  @name = "[component:classified-list]"
  console.log @name, "initializing"

  document.body.scrollTop = 0
  $el = angular.element document.querySelectorAll ".classified-list"
  @masonry = new Masonry $el[0]#, itemSelector: "> li"

  $scope.$watch (-> $el[0].childElementCount), =>
    for child in $el[0].children then @masonry.appended child
    @masonry.layout()

  $scope.toggleClassified = (classified) ->
    if not $scope.currentClassified?
      $scope.$broadcast "classified-changed", classified
      # history.pushState {}, classified.title, '/sdf'
      $scope.currentClassified = classified
    else
      $scope.currentClassified = undefined


  $scope.classifieds = []
  classified.search {}, (error, classifieds) =>
    for classified in classifieds
      classified.showStatus = true
      classified.isUrgent = false
      classified.imageLoaded = => @masonry.layout()
      if classified.images and classified.images.length > 0
        classified.hasImages = true
    $scope.classifieds = classifieds

  $scope.onScroll = -> console.log @name, "scrolling"


exports.$inject = [
  "$scope"
  "$location"
  "$element"
  "model.classified"
]