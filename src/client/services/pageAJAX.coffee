exports = module.exports = ($http, $log, $location) -> new class
  name: "[pageAJAX]"

  load: -> $http.get $location.url()


exports.$inject = [
  "$http"
  "$log"
]
