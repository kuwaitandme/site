name = "[model:news/stories]"


exports = module.exports = ($environment, $http, $log, $storage) ->
  new class Model

    top: ->
      API = "#{$environment.url}/api/news/top"
      $log.log name, "fetching top news stories from server by id"
      $http.get "#{API}"


    create: (data) ->
      $http
        data: data
        method: "POST"
        url: "#{$environment.url}/api/news/stories"

    upvote: (id) ->
      $http
        method: "PUT"
        url: "#{$environment.url}/api/news/stories/#{id}/upvote"

    createComment: (id, data) ->
      $http
        data: data
        method: "POST"
        url: "#{$environment.url}/api/news/stories/#{id}/comments"


exports.$inject = [
  "$environment"
  "$http"
  "$log"
  "$storage"
]
