currentUser = {}
roles =
  NORMAL: 0
  MODERATOR: 1
  ADMIN: 2

statuses =
  INACTIVE: 0
  ACTIVE: 1
  BANNED: 2
  SUSPENDED: 3

model = ->
model::name = "[model:user]"


exports = module.exports = ($http, $root, $log, $storage, $environment) ->

  # Updates the current user
  model::updateUser = (user) ->
    $log.log model::name, "updating the current user"
    currentUser = user
    $root.bodyClasses["logged-in"] = model::isLoggedIn()
    $storage.session "models:user:current", angular.toJson user


  # Returns the current user
  model::getCurrent = ->
    if currentUser? and currentUser.id then currentUser
    else (angular.fromJson $storage.session "models:user:current") or {}


  # Use these functions to check if a user is logged-in/logged-out
  model::isLoggedIn = -> model::getCurrent().id?
  model::isAnonymous = -> not isLoggedIn()


  # Re-downloads the user from the server.
  model::refresh = ->
    $http.get "#{$environment.url}/api/users/current"
    .then model::updateUser


  # A simple function to perform a user-logout. Deletes the current session
  # both locally and from the server.
  model::logout = ->
    $http.get "#{$environment.url}/api/auth/logout"
    .then model::updateUser


  # Download the current user from either the sessionStorage or from the API
  model::download = ->
    # This helper function is used to get the user details from the API
    fetchFromAPI = ->
      $log.log model::name, "downloading user"
      $http.get "#{$environment.url}/api/users/current"
      .then model::updateUser
    # Attempt to get the user from the cache.
    cache = $storage.session "models:user:current"
    if cache?
      # user was found in session cache, prepare to translate it and return
      $log.log model::name, "retrieving current user from cache"
      try model::updateUser angular.fromJson cache
      catch exception
        # Something went wrong while parsing the locations. No problem,
        # we'll retrieve it from the API.
        fetchFromAPI()
    else
      # locations were never saved. So retrieve it from the API.
      $log.log model::name, "retrieving current user from API"
      fetchFromAPI()


  new model


exports.$inject = [
  "$http"
  "$rootScope"
  "$log"
  "$storage"
  "$environment"
]
