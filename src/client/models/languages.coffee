exports = module.exports = ($http, $log) -> new class
  name: "[model:language]"

  dictonary:
    activate_fail: "Your account failed to activate!"
    activate_success: "Your account has been activated!"
    login_success: "Welcome _NAME_, you are now logged in!"
    oauth_fail: "Your account didn't allow us to get your email :( Try some other login method"
    oauth_success: "Welcome _NAME_, you are now logged in!"
    logout: "You have been logged out successfully"
    need_login: "You need to be logged in to view that page"
    need_login_for_post: "You need to be logged to post classifieds!"
  translate: (key) -> @dictonary[key] or ""



  # ###
  # ## *getAll(callback):*
  # This function returns an array of all the languages from the server. The
  # callback function follows a node-style pattern and should look something like
  # this.

  #   callback = function(error, languages) { LOGIC HERE };

  # ###
  # getAll: (callback) -> @languages



  # findBySlug: (slug) ->
  #   for cat in @languages
  #     if cat.slug is slug then return cat
  #     for childcat in cat.children
  #       if childcat.slug is slug then return childcat
  #   {}

  # findById: (id) ->
  #   for cat in @languages
  #     if cat._id is id then return cat
  #     for childcat in cat.children
  #       if childcat._id is id then return childcat
  #   {}


  # download: ->
  #   if @languages? then return

  #   $log.log @name, "downloading languages"
  #   cache = $cache.get "models:language"
  #   # A helper function to retrieve the languages from the API
  #   _fetchFromAPI = =>
  #     $http.get "/api/language/en"
  #     .success (languages) =>
  #       @languages = languages
  #       $cache.set "models:language", angular.toJson languages

  #   if cache?
  #     # languages was found in cache, prepare to translate it and return
  #     $log.log @name, "retrieving languages from cache"
  #     try
  #       @languages = angular.fromJson cache
  #     catch exception
  #       # Something went wrong while parsing the languages. No problem, we"ll
  #       # retrieve it from the API.
  #       _fetchFromAPI()
  #   else
  #     # languages were never saved. So retrieve it from the API.
  #     $log.log @name, "retrieving languages from API"
  #     _fetchFromAPI()


exports.$inject = [
  "$http"
  "$log"
]
