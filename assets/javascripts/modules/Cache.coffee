###
## *Cache* module
This module is responsible for only interacting with the HTML5 localStorage and
providing safe functions to interact with it. This module is key for performance
because it hacks on the localStorage to cache components of the site and
increase responsiveness of the site.

This module in production mode caches all startup scripts and reuses them when
the user navigates to the page for the second time, shortening load time to <
100ms. It also caches data that doesn't change that often like the locations and
the categories of classifieds.
###
module.exports = class controller
  name: '[cache]'
  fallback: false

  ###
  ## *constructor():*
  Checks the JS version from the server side and setups the local storage
  based on it. If the JS version from the local and the server are
  different, then reset the local storage. Otherwise have the local storage
  cache every page template that it downloads.

  Also, if the browser does not support localStorage use fallback methods.
  ###
  constructor: (app, @config) ->
    console.log @name, 'initializing'

    # Check if localStorage is supported
    if Storage?
      @checkVersions()

      # Cache the startup scripts for the next time the user visits the
      # site. Begin the cache after 3 seconds so that other AJAX requests
      # finish by then.
      setTimeout (=> @cacheStartupScripts()), 3000

    else
      # Setup fallback methods
      @fallback = true
      console.log @name, 'HTML5 Storage not supported. Using fallback methods'
      console.warn @name, 'no fallback methods for cache have been implemented so far'


  ###
  ## *checkVersions():*
  This function checks the version of the different kinds of data that is
  stored in the cache. Basically the version control allows the server to
  demand the clients to clear the cache whenever it wants to and update
  itself with the new version.
  ###
  checkVersions: ->
    console.log @name, "checking cache version"
    magic = window.config.magic or {}

    _clearApplicationCache =  -> _removeKeysHelper 'app'
    _clearLibrariesCache =    -> _removeKeysHelper 'library'
    _clearModelsCache =       -> _removeKeysHelper 'models'
    _removeKeysHelper = (tag) ->
      keysToRemove = []
      for i in [0...localStorage.length]
        key = localStorage.key i
        if key? and ((key.split ':')[0] == tag) then keysToRemove.push key
      localStorage.removeItem key for key in keysToRemove

    if (@get 'magic:library') != magic.library
      console.log @name, "library caches differ, clearing"
      _clearLibrariesCache()
      @set 'magic:library', magic.library

    if (@get 'magic:models') != magic.models
      console.log @name, "model caches differ, clearing"
      _clearModelsCache()
      @set 'magic:models', magic.models

    if (@get 'magic:application') != magic.application
      console.log @name, "application caches differ, clearing"
      _clearApplicationCache()
      @set 'magic:application', magic.application


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
    if @fallback then return

    # The list of scripts is accessible to us by the global variable 'scripts'
    for script in scripts
      storageIdentifier = script.name

      # Check if the script already exists in the cache
      if script.localSrc? and not @get storageIdentifier
        console.log @name, "caching script:", script.name

        # Start fetching the local version of the script asynchronously, and
        # save it into the cache.
        ajax = (storageIdentifier, script) =>
          $.ajax
            url: script.localSrc,
            success: (result) =>
              @set storageIdentifier, result
              console.log @name, "cached script:", storageIdentifier
        ajax storageIdentifier, script


  ###
  ## *set(key, value):*
  A simple function to store a key-value pair into the cache
  ###
  set: (key, string) ->
    if @fallback then return
    console.log @name, "setting '#{key}' into cache"
    localStorage.setItem key, string


  ###
  ## *get(key):*
  Function to get a key-string pair from the cache, given the key
  ###
  get: (key) ->
    if @fallback then return
    console.log @name, "retrieving '#{key}' from cache"
    localStorage.getItem key