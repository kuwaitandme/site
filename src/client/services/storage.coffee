###
  This service offers an interface to three kinds of storage. Temporary, local
  and session.

  Temporary storage: Use this to save objects that only need to live within the
  lifetime of the current window/tab.

  Local storage: Use this to save objects that only need to live forever. They
  don't get erased unless the user decides to clear the browser's saved data.

  Session storage: Use this to save objects that only need to withing the
  current session. They get erased when the user closes the tab.
###
name = "[service:storage]"


###*
 * This function creates a fallback storage, which is a nice way to take care
 * of browsers that don't support localStorage but still keep the functionality
 * (somewhat) of the storages.
 *
 *
 * @return Class     A storage class that can get/set data locally to it.
###
createFallbackStorage = ->
  fn = (key, value) ->
    @privateData ?= {}
    if key == null and value == null
      @privateData = {}
    else if typeof value is "undefined"
      @privateData[key]
    else
      if value? then @privateData[key] = value
      else delete @privateData[key] # value was set to null
  fn.privateData = {}
  fn


###*
 * This function acts as a getter and setter with the added plus of a remove
 * function too!
 *
 *
 * @param  Storage  storage   The HTML5 storage to work on.
 * @param  Object   key       The key to get/set. If this value is set to null
 *                            then the entire storage is cleared.
 * @param  Object   value     The value of the key. If this is undefined then
 *                            the function acts like a get. If this has a valid
 *                            value then the function acts like a set. If the
 *                            value is set to null, then the value is cleared.
 *
 * @return Object           Returns the object save at the key if requested
 *                          for the get method.
###
operate = (storage, key, value) ->
  if key == null and value == null then storage.clear()
  else if typeof value is "undefined" then return storage.getItem key
  else if value? then return storage.setItem key, value
  else return storage.removeItem key


###*
 * A simple function to check if localStorage is supported. We assume if
 * localStorage and sessionStorage exists or don't exist together.
 *
 *
 * @return Boolean    True iff localStorage is supported on the device.
###
supportsHTML5storage = ->
  try $window["localStorage"]? catch e then false
  true


exports = module.exports = ($environment, $log, $window) ->
  class Storage
    constructor: ->
      $log.log name, "initializing"

      # Setup the temporary storage
      $log.log name, "setting up temporary storage"
      @tmp = createFallbackStorage()

      # Check if HTML5 localStorage is supported.
      if supportsHTML5storage()
        $log.log name, "setting up local and session storage"

        # Create the getter and setter methods for local and session...
        @local = (key, value) -> operate localStorage, key, value
        @session = (key, value) -> operate sessionStorage, key, value

      # If not then create fallback storages for both session and local.
      else
        $log.warn name, "using fallback storages for local and session"
        @fallback = true
        @local = createFallbackStorage()
        @session = createFallbackStorage()

  new Storage


exports.$inject = [
  "$environment"
  "$log"
  "$window"
]
