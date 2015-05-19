exports = module.exports = ($http, $log, $root, $storage) -> new class
  name: "[service:notifications]"
  constructor: -> $log.log @name, "initializing"

  # Returns a list of all the notifications
  getAll: ->


  create: (message, type="success", timeout=5000) ->
    $root.$broadcast "notification",
      text: message, type: type, hasRead: false, flash: true, timeout: timeout


  error:   (message, timeout) -> @create message, "error", timeout
  success: (message, timeout) -> @create message, "success", timeout
  warn:    (message, timeout) -> @create message, "warn", timeout

  parseURL: ->
exports.$inject = [
  "$http"
  "$log"
  "$rootScope"
  "$storage"
]