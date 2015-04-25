controller = ($scope, $location, $http, cache) ->
  @name = '[partial:category-list]'
  console.log @name, "initializing"

  $scope.categories = []


  $http.get "/api/category"
  .success (categories) ->

    for category in categories
      category.sprite = (category.name.replace ',', ' ').split(' ')[0].toLowerCase()

      # Add the click handler
      category.extraClass = ''
      category.toggleChildren = ->
        @extraClass = if @extraClass is 'show-children' then '' else 'show-children'

    $scope.categories = categories

    # console.log responses

  $scope.onScroll = ->
    console.log @name, "scrolling"


module.exports = controller