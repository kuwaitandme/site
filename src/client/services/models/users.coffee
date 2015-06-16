currentUser = {}

class User
  roles:
    NORMAL: 0
    MODERATOR: 1
    ADMIN: 2

  statuses:
    INACTIVE: 0
    ACTIVE: 1
    BANNED: 2
    SUSPENDED: 3

  defaults:
    login_providers: {}
    meta: {}
    personal: {}

  constructor: (data) -> @set data

  isAnonymous: -> not @user.id?

  isActive: -> @user.status is @statuses.ACTIVE
  isBanned: -> @user.status is @statuses.BANNED
  isInactive: -> @user.status is @statuses.INACTIVE
  isSuspended: -> @user.status is @statuses.SUSPENDED

  isAdmin: -> @user.role is @roles.ADMIN
  isModerator: -> @user.role is @roles.MODERATOR

  get: -> @user
  set: (data) -> @user = angular.extend @defaults, data


currentUser = new User


exports = module.exports = ($http, $root, $log, $storage, $environment) ->
  name = "[model:user]"

  # Updates the current user
  updateUser = (data) ->
    currentUser.set data
    $root.bodyClasses["logged-in"] = not currentUser.isAnonymous()
    $log.log name, "updating the current user"


  class Model
    constructor: -> $log.log name, "initializing"

    # Returns the current user
    getCurrent: -> currentUser

    # Use these functions to check if a user is logged-in/logged-out
    isLoggedIn: -> not currentUser.isAnonymous()
    isAnonymous: -> not currentUser.isAnonymous()


    # Re-downloads the user from the server.
    refresh: ->
      $http.get "#{$environment.url}/api/users/current"
      .then updateUser


    # A simple function to perform a user-logout. Deletes the current session
    # both locally and from the server.
    logout: ->
      $http.get "#{$environment.url}/api/auth/logout"
      .then updateUser


    # Download the current user from either the sessionStorage or from the API
    download: ->
      # This helper function is used to get the user details from the API
      fetchFromAPI = ->
        $log.log name, "downloading user"
        $http.get "#{$environment.url}/api/users/current"
        .success updateUser

      # Attempt to get the user from the cache.
      cache = $storage.session "models:user:current"
      if cache?
        # user was found in session cache, prepare to translate it and return
        $log.log name, "retrieving current user from cache"
        try updateUser angular.fromJson cache
        catch exception
          # Something went wrong while parsing the locations. No problem,
          # we'll retrieve it from the API.
          fetchFromAPI()
      else
        # locations were never saved. So retrieve it from the API.
        $log.log name, "retrieving current user from API"
        fetchFromAPI()


    # Performs an API call to login the user using Email.
    login: (credentials, headers) ->
      $http
        data: credentials
        method: "POST"
        headers: headers
        url: "#{$environment.url}/api/auth/email/login"
      .then (response) ->
        updateUser response.data
        response


    # Performs an API call to signup the user using Email.
    signup: (details, headers) ->
      $http
        data: details
        method: "POST"
        headers: headers
        url: "#{$environment.url}/api/auth/email/signup"


  new Model


exports.$inject = [
  "$http"
  "$rootScope"
  "$log"
  "$storage"
  "$environment"
]
