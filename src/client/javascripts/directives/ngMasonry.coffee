module.exports = ->
  controller: ($scope, $attrs) ->
    console.log $scope, $attrs
  link: (scope, element, attributes) ->
    itemSelector = attributes.ngMasonry or ""
    # if itemSelector.length > 0
    #   # scope.masonry = new Masonry element[0], itemSelector: itemSelector
    # else
    scope.masonry = new Masonry element[0]