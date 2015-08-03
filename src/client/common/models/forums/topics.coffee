name = "[model:forums/topics]"


exports = module.exports = ($environment, $http, $log, $storage) ->
  new class Model

    get: (id) ->
      API = "#{$environment.url}/api/forums/topics"
      $log.log name, "fetching classified from server by id"
      $log.debug name, "id", id
      # $http.get("#{API}/#{id}").then parseResponse
      $http.get("#{API}")




exports.$inject = [
  "$environment"
  "$http"
  "$log"
  "$storage"
]
