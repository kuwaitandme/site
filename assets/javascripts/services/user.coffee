module.exports = ($http) ->
  name: "[service:user]"

  setCurrentUser: (@currentUser) ->
  getCurrentUser: -> @currentUser or {}
  isLoggedIn: -> @getCurrentUser()._id?

  downloadCurrentUser: ->
    console.log @name, "downloading user"
    ($http.get '/api/user').success (data) => @currentUser = data

  get: (id) ->
  save: ->