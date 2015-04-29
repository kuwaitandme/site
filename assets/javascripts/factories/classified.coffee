exports = module.exports = ($http) ->
  class Model
    name: "[model:classified]"

    query: (page=1) -> $http.post "/api/query?page=#{page}"

    save: ->

    search: (parameters, callback) ->
      $http.get "/api/classified"
      .success (classifieds) -> callback null, classifieds
      .error callback

    get: (id, callback) ->
      $http.get "/api/classified/#{id}"
      .success (classified) -> callback null, classified
      .error callback
  new Model


exports.$inject = ["$http"]