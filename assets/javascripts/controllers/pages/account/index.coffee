exports = module.exports = ($scope, console) ->
  @name = "[page:account-index]"
  console.log @name, "initializing"

  # $el = angular.element document.querySelectorAll "main > .row"
  # @masonry = new Masonry $el[0], itemSelector: ".columns"


exports.$inject = [
  "$scope"
  "$log"
]