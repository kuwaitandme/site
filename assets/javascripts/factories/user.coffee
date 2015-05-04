exports = module.exports = ($http, $rootScope) ->
  class Model
    name: "[model:user]"

    setCurrentUser: (@currentUser) ->
    getCurrentUser: -> @currentUser or {}
    isLoggedIn: -> @getCurrentUser().id?

    logout: ->
      @currentUser = undefined
      $http.get "/api/auth/logout"
      .success (data, status) => console.log @name, "logout successful!"
      .error (data, status) => console.error @name, data, status

    download: ->
      if not @currentUser?
        console.log @name, "downloading user"
        ($http.get "/api/user/current").success (data) =>
          @currentUser = data
          if @isLoggedIn() then
          $rootScope.extraClass = $rootScope.extraClass or {}
          $rootScope.extraClass["logged-in"] = @isLoggedIn()

    get: (id) ->
    save: ->

  new Model


exports.$inject = [
  "$http"
  "$rootScope"
]