###
  This service offers an interface to three kinds of storage. Temporary, local
  and session.

  Temporary storage: Use this to save objects that only need to live within the
  lifetime of the current window/tab.

  Local storage: Use this to save objects that only need to live forever. They
  don't get erased unless the user decides to clear the browser's saved data.

  Session storage: Use this to save objects that only need to withing the
  current session. They get erased when the user closes the browser.
###
exports = module.exports = ($window) -> new class
  constructor: ->
    # Setup the temporary storage
    @tmp = @_createFallbackStorage()

    # Check if HTML5 localStorage is supported. If not then create fallback
    # storages for both session and local.
    if @_supportsHTML5storage()
      @local = (key, value) => @_operate localStorage, key, value
      @session = (key, value) => @_operate sessionStorage, key, value
    else
      @local = @_createFallbackStorage()
      @session = @_createFallbackStorage()


  # This function acts as a getter and setter with the added plus of a remove
  # function too!
  #
  # TODO: explain this function more
  _operate: (storage, key, value) ->
    if key == null and value == null then storage.clear()
    else if typeof value is "undefined" then return storage.getItem key
    else if value? then return storage.setItem key, value
    else return storage.removeItem key


  # This function creates a fallback storage, which is a nice way to take care
  # of browsers that don't support localStorage but still keep the functionality
  # (somewhat) of the storages.
  _createFallbackStorage: ->
    fn = (key, value) ->
      if key == null and value == null then @privateData = {}
      if typeof value is "undefined" then @privateData[key]
      else
        if value? then @privateData[key] = value
        else delete @privateData[key] # value was set to null
    fn.privateData = {}
    fn


  # A simple function to check if localStorage is supported. We assume if
  # localStorage and sessionStorage exists or don't exist together.
  _supportsHTML5storage: ->
    try $window["localStorage"]?
    catch e then false

exports.$inject = ["$window"]