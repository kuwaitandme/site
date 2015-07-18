name = "[model:news/stories]"


exports = module.exports = ($environment, $http, $log, $storage) ->
  new class Model

    top: ->
      API = "#{$environment.url}/api/news/top"
      $log.log name, "fetching top news stories from server by id"
      $http.get "#{API}"




exports.$inject = [
  "$environment"
  "$http"
  "$log"
  "$storage"
]
