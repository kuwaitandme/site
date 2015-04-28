module.exports = ($scope, $rootScope, $element) ->
  @name = '[page:account-index]'
  console.log @name, 'initializing'
  $rootScope.bodyid = 'account-index'

  # $el = angular.element document.querySelectorAll "main > .row"
  # @masonry = new Masonry $el[0], itemSelector: '.columns'