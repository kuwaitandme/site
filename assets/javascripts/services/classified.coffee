module.exports = ($http) ->
  query: (page=1) -> $http
    method: 'POST'
    url: "/api/query?page=#{page}"

  save: ->

  search: (parameters, callback) ->
    $http.get '/api/classified'
    .success (classifieds) -> callback null, classifieds
    .error callback

  get: (id) -> $http
    method: 'GET'
    url: "/api/classified/#{id}"