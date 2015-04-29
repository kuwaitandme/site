exports = module.exports = ($scope, $rootScope, $element) ->
  @name = "[page:account-manage]"
  console.log @name, "initializing"

  body = document.getElementsByTagName "body"
  body[0].id = "account-manage"


exports.$inject = [
  "$scope"
  "$element"
]