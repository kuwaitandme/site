###
  This service offers an interface to three kinds of storage. Temporary, local
  and session.

  Temporary storage: Use this to save objects that only need to live within the
  lifetime of the current window/tab.

  Local storage: Use this to save objects that only need to live forever. They
  don't get erased unless the user decides to clear the browser's saved data.

  Session storage: Use this to save objects that only need to withing the
  current session. They get erased when the user closes the tab.

  @module Services.Storage
  @author Steven Enamakel <me@steven.pw>
###
StorageService = ($log, $q, $window, environment) ->
  logger = $log.init StorageService.tag
  logger.log "initializing"

  ###
    This function creates a fallback storage, which is a nice way to take care
    of browsers that don't support localStorage but still keep the functionality
    (somewhat) of the storages.

    @return Class     A storage class that can get/set data locally to it.
  ###
  createFallbackStorage = ->
    fn = (key, value) ->
      @privateData ?= {}
      $q (resolve) =>
        if key == null and value == null then resolve @privateData = {}
        else if typeof value is "undefined" then resolve @privateData[key]
        else
          if value? then resolve @privateData[key] = value
          else resolve delete @privateData[key] # value was set to null
    fn



  ###
    A simple function to check if localStorage is supported. We assume if
    localStorage and sessionStorage exists or don't exist together.

    @return Boolean    True iff localStorage is supported on the device.
  ###
  supportsHTML5storage = ->
    try $window["localStorage"]? catch e then false
    true


  class Storage
    ###
      This function acts as a getter and setter with the added plus of a remove
      function too!

      @param  Storage  storage   The HTML5 storage to work on.
      @param  Object   key       The key to get/set. If this value is set to null
                                 then the entire storage is cleared.
      @param  Object   value     The value of the key. If this is undefined then
                                 the function acts like a get. If this has a valid
                                 value then the function acts like a set. If the
                                 value is set to null, then the value is cleared.

      @return Object           Returns the object save at the key if requested
                               for the get method.
    ###
    _operate: (storage, key, value) ->
      $q (resolve, reject) ->
        #! If value and key was set to null then the function was had no
        #! arguments. So we clear the storage!
        if key == null and value == null then resolve storage.clear()

        #! If a key was set but the value was undefined, then we request data
        #! from the storage.
        else if typeof value is "undefined"
          cache = storage.getItem key
          if cache? then resolve cache else reject cache

        #! If a key and a value was set then we request data to be saved with
        #! the key value pair in the storage.
        else if value? then resolve storage.setItem key, value

        #! If the key was set and the value was specifically 'null' then we
        #! remove the key-value pair from the storage.
        else resolve storage.removeItem key


    constructor: ->
      # Setup the temporary storage
      logger.log "setting up temporary storage"
      @tmp = createFallbackStorage()

      # Check if HTML5 localStorage is supported.
      if supportsHTML5storage()
        logger.log "setting up local and session storage"

        # Create the getter and setter methods for local and session...
        @local = (key, value) => @_operate $window.localStorage, key, value
        @session = (key, value) => @_operate $window.sessionStorage, key, value

      # If not then create fallback storages for both session and local.
      else
        logger.warn "using fallback storages for local and session"
        @fallback = true
        @local = createFallbackStorage()
        @session = createFallbackStorage()


  new Storage


StorageService.tag = "service:storage"
StorageService.$inject = [
  "$log"
  "$q"
  "$window"
  "@environment"
]
module.exports = StorageService