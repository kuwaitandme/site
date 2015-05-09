exports = module.exports = ($http, $rootScope, $log, $storage) -> new class
  name: "[model:user]"

  setCurrentUser: (user) -> $storage.session "user:current", user
  getCurrentUser: -> ($storage.session "user:current") or {}
  isLoggedIn: -> @getCurrentUser().id?


  # A simple function to perform a user-logout. Deletes the current session
  # both locally and from the server.
  logout: ->
    $http.get "/api/auth/logout"
    .success (data, status) =>
      $log.log @name, "user logged out"
      $storage.session "user:current", null
      $rootScope.extraClass = $rootScope.extraClass or {}
      $rootScope.extraClass["logged-in"] = @isLoggedIn()


  download: ->
    # This helper function is used to get the user details from the API
    _fetchFromAPI = =>
      $log.log @name, "downloading user"
      $http.get "/api/user/current"
      .success (user) =>
        $log.log @name, "fetched current user"
        $log.debug @name, user
        $storage.session "user:current", angular.toJson user
        $rootScope.extraClass = $rootScope.extraClass or {}
        $rootScope.extraClass["logged-in"] = @isLoggedIn()

    # Attempt to get the user from the cache.
    cache = $storage.session "user:current"
    if cache? and false
      # user was found in session cache, prepare to translate it and return
      $log.log @name, "retrieving current user from cache"
      try angular.fromJson cache
      catch exception
        # Something went wrong while parsing the locations. No problem,
        # we'll retrieve it from the API.
        _fetchFromAPI()
    else
      # locations were never saved. So retrieve it from the API.
      $log.log @name, "retrieving current user from API"
      _fetchFromAPI()


exports.$inject = [
  "$http"
  "$rootScope"
  "$log"
  "$storage"
]