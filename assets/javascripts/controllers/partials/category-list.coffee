controller = ($scope, $location, $http) ->
  @name = '[partial:category-list]'
  console.log @name, "initializing"

  $scope.categories = []

  $http.get "/api/category"
  .success (categories) ->
    # console.log categories
    for category in categories
      category.className = (category.name.replace ',', ' ').split(' ')[0].toLowerCase()
      # classified.isUrgent = false
      # console.log classified
      # console.log 'sd', category

    $scope.categories = categories

    # console.log response

  $scope.onScroll = ->
    console.log @name, "scrolling"


module.exports = controller