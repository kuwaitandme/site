exports = module.exports = ($http) ->
  class Model
    name: "[model:classified]"

    query: (page=1) -> $http.post "/api/query?page=#{page}"


    save: (classified={}) ->
      if not classified._id?
        method = "POST"
        url = "/api/classified"
      else
        method = "PUT"
        url = "/api/classified/#{classified._id}"
      console.log @name, "sending classified to server [#{method}]"
      console.debug @name, classified


    search: (parameters, callback) ->
      $http.get "/api/classified"
      .success (classifieds) -> callback null, classifieds
      .error callback


    get: (id, callback) ->
      $http.get "/api/classified/#{id}"
      .success (classified) -> callback null, classified
      .error callback

    getDefault: ->
      contact:       {}
      filesToDelete: []
      images:        []
      meta:          {}
      perks:         {}
      reports:       []

  new Model


exports.$inject = ["$http"]