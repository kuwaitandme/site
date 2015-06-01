exports = module.exports = ($http, $log, $root, $storage) -> new class
  name: "[service:notifications]"
  constructor: -> $log.log @name, "initializing"

  # Returns a list of all the notifications
  getAll: ->


  _create: (message, type="success", timeout=5000) ->
    $root.$broadcast "notification",
      flash: true, hasRead: false, text: message, timeout: timeout, type: type


  error: (message, timeout) -> @_create message, "error", timeout
  success: (message, timeout) -> @_create message, "success", timeout
  warn: (message, timeout) -> @_create message, "warn", timeout

  parseURL: ->


exports.$inject = [
  "$http"
  "$log"
  "$rootScope"
  "$storage"
]
