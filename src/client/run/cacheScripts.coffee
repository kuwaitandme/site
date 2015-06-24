exports = module.exports = ($http, $timeout, $window, $log, $storage,
$environment) -> new class
  name: "[run:cacheScripts]"
  fallback: false

  ###
  ## *constructor():*
  Checks the JS version from the server side and setups the local storage
  based on it. If the JS version from the local and the server are
  different, then reset the local storage. Otherwise have the local storage
  cache every page template that it downloads.

  Also, if the browser does not support localStorage use fallback methods.
  ###
  constructor: ->
    $log.log @name, "initializing"

    # Check if localStorage is supported
    @fallback = false or $storage.fallback
    if @fallback then return

    # Cache the startup scripts for the next time the user visits the
    # site. Begin the cache after 7 seconds so that other AJAX requests
    # finish by then.
    @checkVersions()
    $timeout (=> @cacheStartupScripts()), 1000


  ###
  ## *checkVersions():*
  This function checks the version of the different kinds of data that is
  stored in the cache. Basically the version control allows the server to
  demand the clients to clear the cache whenever it wants to and update
  itself with the new version.
  ###
  checkVersions: ->
    $log.log @name, "checking cache version"
    md5 = $environment.md5 or {}
    storageKeys = []

    # Now start iterating through every key in the localStorage
    for i in [0...localStorage.length]
      # Filter out keys that don't start with "script:"
      storageKey = localStorage.key(i) or ""
      keyParts = storageKey.split ":"
      if keyParts[0] is "md5"
        filename = keyParts[1]
        # If the MD5 sum does not match then clear the localStorage cache
        if md5[filename] is not $storage.local storageKey
          $log.log @name, "clearing cache for file:", filename
          $storage.local storageKey, null



    # # Helper function to manage the localStorage keys
    # _clearApplicationCache =  -> _removeKeysHelper "app"
    # _clearLibrariesCache =    -> _removeKeysHelper "library"
    # _clearModelsCache =       -> _removeKeysHelper "models"
    # _removeKeysHelper = (tag) ->
    #   keysToRemove = []
    #   for i in [0...localStorage.length]
    #   localStorage.removeItem key for key in keysToRemove
    # # Check the library's versions
    # if ($storage.local "magic:library") != String magic.library
    #   $log.log @name, "library caches differ, clearing"
    #   _clearLibrariesCache()
    #   $storage.local "magic:library", String magic.library
    # # Check the models's versions
    # if ($storage.local "magic:models") != String magic.models
    #   $log.log @name, "model caches differ, clearing"
    #   _clearModelsCache()
    #   $storage.local "magic:models", String magic.models
    # # Check the app's versions
    # if ($storage.local "magic:application") != String magic.application
    #   $log.log @name, "application caches differ, clearing"
    #   _clearApplicationCache()
    #   $storage.local "magic:application", String magic.application


  ###
  ## *cacheStartupScripts():*
  This function is responsible for saving all the startup scripts
  (eg: jQuery, Backbone, Masonry) into the localStorage cache. This way the
  next time the user open the page, site will immediately load the scripts
  from the cache and avoid making requests from the CDN.

  The code that loads the script that is saved in the local path of the app.
  This is done, because most browsers don't allow cross-browser requests
  and saving the scripts local is a solution for this.
  ###
  cacheStartupScripts: ->
    $log.log @name, "downloading scripts"
    if @fallback then return
    md5 = $environment.md5 or {}

    # The list of scripts is accessible to us by the global variable "scripts"
    for script in scripts then do (script) ->
      storageId = "script:#{script.id}"
      md5ID = "md5:#{script.id}"
      # Check if the script already exists in the cache
      cache = $storage.local storageId

      # $log.log storageId, cache, cache == null
      # $log.log script, not ($storage.local storageId)?
      if script.local and not $storage.local storageId
        $log.log @name, "caching script:", script.id
        # Start fetching the local version of the script asynchronously, and
        # save it into the cache.
        ajax = (storageId, url) =>
          try
            $http.get url
            .success (result) =>
              $storage.local storageId, result
              $storage.local md5ID, md5[script.id]
              $log.log @name, "cached sscript:", script.id
          catch e
            $log.error @name, "could not cache script", script.id
            $log.error @name, "url was", url
            $log.error e.stack
        ajax storageId, script.local


exports.$inject = [
  "$http"
  "$timeout"
  "$window"
  "$log"
  "$storage"
  "$environment"
]
