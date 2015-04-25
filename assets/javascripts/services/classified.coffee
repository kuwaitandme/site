module.exports = ($http) ->
  query: (page=1) -> $http
    method: 'POST'
    url: "/api/query?page=#{page}"

  create: ->

  update: ->

  patch: ->

  get: (id) -> $http
    method: 'GET'
    url: "/api/classified/#{id}"