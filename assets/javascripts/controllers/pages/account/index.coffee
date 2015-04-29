exports = module.exports = ($scope, $element) ->
  @name = "[page:account-index]"
  console.log @name, "initializing"

  body = document.getElementsByTagName "body"
  body[0].id = "account-index"

  # $el = angular.element document.querySelectorAll "main > .row"
  # @masonry = new Masonry $el[0], itemSelector: ".columns"


exports.$inject = [
  "$scope"
  "$element"
]