exports = module.exports = ($http, $root, console, $storage) -> new class
  name: "[model:user]"

  setCurrentUser: (user) -> $storage.session "user:current", user
  getCurrentUser: -> (angular.fromJson $storage.session "user:current") or {}
  isLoggedIn: -> @getCurrentUser().id?

  constructor: ->
    $root.$on "user:changed", => @onUserChange()
    $root.bodyClasses ?= {}


  onUserChange: (user) ->
    $root.bodyClasses["logged-in"] = @isLoggedIn()


  # A simple function to perform a user-logout. Deletes the current session
  # both locally and from the server.
  logout: ->
    $http.get "/api/auth/logout"
    .success (data, status) =>
      console.log @name, "user logged out"
      $storage.session "user:current", null
      $root.$broadcast "user:changed"


  # Download the current user from either the sessionStorage or from the API
  download: ->
    # This helper function is used to get the user details from the API
    _fetchFromAPI = =>
      console.log @name, "downloading user"
      $http.get "/api/users/current"
      .success (user) =>
        console.log @name, "fetched current user"
        console.debug @name, user
        $storage.session "user:current", angular.toJson user
        $root.$broadcast "user:changed"

    # Attempt to get the user from the cache.
    cache = $storage.session "user:current"
    if cache?
      # user was found in session cache, prepare to translate it and return
      console.log @name, "retrieving current user from cache"
      try
        angular.fromJson cache
        $root.$broadcast "user:changed"
      catch exception
        # Something went wrong while parsing the locations. No problem,
        # we'll retrieve it from the API.
        _fetchFromAPI()
    else
      # locations were never saved. So retrieve it from the API.
      console.log @name, "retrieving current user from API"
      _fetchFromAPI()


exports.$inject = [
  "$http"
  "$rootScope"
  "$log"
  "$storage"
]