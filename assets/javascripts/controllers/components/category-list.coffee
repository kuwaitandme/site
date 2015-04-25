controller = ($scope, $location, $http, category) ->
  @name = '[partial:category-list]'
  console.log @name, "initializing"

  $scope.categories = []

  category.getAll (error, categories) ->
    for category in categories
      # The sprite is the classname we will use to add the category's image
      category.sprite = (category.name.replace ',', ' ').split(' ')[0].toLowerCase()

      # Add the click handler
      category.extraClass = ''
      category.toggleChildren = ->
        @extraClass = if @extraClass is 'show-children' then '' else 'show-children'

    $scope.categories = categories

  $scope.onScroll = ->
    console.log @name, "scrolling"


module.exports = controller