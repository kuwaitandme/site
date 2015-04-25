controller = ($scope, $location, $http) ->
  @name = '[partial:classified-list]'
  console.log @name, "initializing"

  $scope.classifieds = []

  $http.post "/api/query"
  .success (classifieds) ->
    for classified in classifieds
      classified.showStatus = true
      classified.isUrgent = false
      # console.log classified
      if classified.images and classified.images.length > 0
        classified.hasImages = true
    $scope.classifieds = classifieds

    # console.log response

  $scope.onScroll = ->
    console.log @name, "scrolling"


module.exports = controller