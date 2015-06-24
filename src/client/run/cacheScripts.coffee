###
Checks the JS version from the server side and setups the local storage
based on it. If the JS version from the local and the server are
different, then reset the local storage. Otherwise have the local storage
cache every page template that it downloads.

Also, if the browser does not support localStorage uses fallback temporary
storage. (which technically doesn't really help.. but whatever..)
###
exports = module.exports = ($http, $timeout, $window, $log, $storage,
$environment) ->
  name = "[run:cacheScripts]"
  fallback = false
  md5 = $environment.md5 or {}

  ###
  This function checks the version of the different kinds of data that is
  stored in the cache. Basically the version control allows the server to
  demand the clients to clear the cache whenever it wants to and update
  itself with the new version.
  ###
  checkVersions = ->
    $log.log name, "checking cache version"
    storageKeys = []

    # Now start iterating through every key in the localStorage
    for i in [0...localStorage.length]
      # Filter out keys that don't start with "script:"
      storageKey = localStorage.key(i) or ""
      keyParts = storageKey.split ":"
      if keyParts[0] is "md5"
        filename = keyParts[1]
        # If the MD5 sum does not match then clear the localStorage cache
        if md5[filename] != $storage.local storageKey
          $log.log name, "clearing cache for file:", filename
          $storage.local storageKey, null



  ###
  This function is responsible for saving all the startup scripts
  (eg: jQuery, Backbone, Masonry) into the localStorage cache. This way the
  next time the user open the page, site will immediately load the scripts
  from the cache and avoid making requests from the CDN.

  The code that loads the script that is saved in the local path of the app.
  This is done, because most browsers don't allow cross-browser requests
  and saving the scripts local is a solution for this.
  ###
  cacheStartupScripts = ->
    if fallback then return
    $log.log name, "caching startup scripts via async"

    # The list of scripts is accessible to us by the global variable "scripts"
    for script in $window.scripts then do (script) ->
      storageId = "script:#{script.id}"
      md5ID = "md5:#{script.id}"

      localMD5 = $storage.local md5ID
      remoteMD5 = md5[script.id]

      # Check if the script already exists in the cache
      cache = $storage.local storageId
      if script.local and not localMD5

        # If the script was not in cache then start fetching the local version
        # of the script asynchronously, and then save it into the cache.
        $log.log name, "caching script:", script.id
        ajax = (storageId, url) ->
          try
            $http.get url
            .then (response) ->
              # Update the script and the MD5 hash of it
              $storage.local storageId, response.data
              $storage.local md5ID, remoteMD5
              $log.log name, "cached script:", script.id

          catch e
            $log.error name, "could not cache script", script.id
            $log.error name, "url was", url
            $log.error e.stack
        ajax storageId, script.local


  new ->
    $log.log name, "initializing"

    # Check if localStorage is supported
    fallback = false or $storage.fallback
    if fallback then return

    # Cache the startup scripts for the next time the user visits the
    # site. Begin the cache after 7 seconds so that other AJAX requests
    # finish by then.
    checkVersions()
    $timeout cacheStartupScripts, 1000


exports.$inject = [
  "$http"
  "$timeout"
  "$window"
  "$log"
  "$storage"
  "$environment"
]
