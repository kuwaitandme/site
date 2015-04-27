controller = ($scope, $location, $element, classified) ->
  @name = '[component:classified-list]'
  console.log @name, "initializing"

  @masonry = new Masonry $element[0]#, itemSelector: '> li'

  $scope.$watch ->
    $element[0].childElementCount
  , =>
    for child in $element[0].children
      console.log child, $element
      @masonry.appended child
    @masonry.layout()

  $scope.classifieds = []
  window.a = $element[0]
  classified.search {}, (error, classifieds) =>
    for classified in classifieds
      classified.showStatus = true
      classified.isUrgent = false
      classified.imageLoaded = => @masonry.layout()
      if classified.images and classified.images.length > 0
        classified.hasImages = true
    $scope.classifieds = classifieds

  $scope.onScroll = -> console.log @name, "scrolling"


module.exports = controller