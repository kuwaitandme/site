exports = module.exports = ($httpProvider) ->
  $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"


exports.$inject = ["$httpProvider"]