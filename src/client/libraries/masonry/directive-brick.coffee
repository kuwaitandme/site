module.exports = ->
  require: ["^masonryMaster", "^masonryContainer"]
  link: (scope, element, attributes) ->
    # options = angular.fromJson attributes.fnMasonry
    # itemSelector = attributes.ngMasonry or ""
    # # if itemSelector.length > 0
    # #   # scope.masonry = new Masonry element[0], itemSelector: itemSelector
    # # else

    # scope.masonry = new Masonry element[0], options
    # console.log scope
    # # gutter
