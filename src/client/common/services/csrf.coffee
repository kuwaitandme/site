exports = module.exports = ($environment, $http, $log) -> new class
  name: "[service:notifications]"
  constructor: -> $log.log @name, "initializing"

  getToken: -> $http.get "#{$environment.url}/api/csrf"


exports.$inject = [
  "$environment"
  "$http"
  "$log"
]
