exports = module.exports = ($http, $log, $root, $storage) -> new class
  name: "[service:notifications]"
  constructor: -> $log.log @name, "initializing"

  # Returns a list of all the notifications
  getAll: ->


  create: (message, type="success") ->
    $root.$broadcast "notification",
      text: message, type: type, hasRead: false, flash: true


  error:   (message) -> @create message, "error"
  success: (message) -> @create message, "success"
  warn:    (message) -> @create message, "warn"

  parseURL: ->
exports.$inject = [
  "$http"
  "$log"
  "$rootScope"
  "$storage"
]