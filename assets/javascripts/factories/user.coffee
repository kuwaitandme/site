exports = module.exports = ($http, $rootScope, $storage) ->
  class Model
    name: "[model:user]"

    setCurrentUser: (@currentUser) ->
    getCurrentUser: -> ($storage.session "user:current") or {}
    isLoggedIn: -> @getCurrentUser().id?


    # A simple function to perform a user-logout. Deletes the current session
    # both locally and from the server.
    logout: ->
      $http.get "/api/auth/logout"
      .success (data, status) =>
        console.log @name, "logout successful!"
        $storage.session "user:current", null
        $rootScope.extraClass = $rootScope.extraClass or {}
        $rootScope.extraClass["logged-in"] = @isLoggedIn()


    download: ->
      # This helper function is used to get the user details from the API
      _fetchFromAPI = =>
        console.log @name, "downloading user"
        $http.get "/api/user/current"
        .success (data) =>
          $storage.session "user:current", data
          $rootScope.extraClass = $rootScope.extraClass or {}
          $rootScope.extraClass["logged-in"] = @isLoggedIn()

      # Attempt to get the user from the cache.
      cache = $storage.session "user:current"
      if cache? and false
        # user was found in session cache, prepare to translate it and return
        console.log @name, "retrieving current user from cache"
        try angular.fromJson cache
        catch exception
          # Something went wrong while parsing the locations. No problem,
          # we'll retrieve it from the API.
          _fetchFromAPI()
      else
        # locations were never saved. So retrieve it from the API.
        console.log @name, "retrieving current user from API"
        _fetchFromAPI()


  new Model


exports.$inject = [
  "$http"
  "$rootScope"
  "$storage"
]