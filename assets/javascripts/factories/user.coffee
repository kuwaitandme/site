module.exports = ($http) ->
  class Model
    name: "[service:user]"

    setCurrentUser: (@currentUser) ->
    getCurrentUser: -> @currentUser or {}
    isLoggedIn: -> @getCurrentUser()._id?

    download: ->
      if not @currentUser?
        console.log @name, "downloading user"
        ($http.get '/api/user').success (data) => @currentUser = data

    get: (id) ->
    save: ->
  new Model