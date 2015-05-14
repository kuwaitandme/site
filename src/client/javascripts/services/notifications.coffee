exports = module.exports = ($http, $root, console, $storage) -> new class
  name: "[service:notifications]"

  constructor: ->
    console.log @name, "initializing"

  # Returns a list of all the notifications
  getAll: ->


  create: (message, type="success") ->
    $root.$broadcast "notification",
      text: message, type: type, hasRead: false, flash: true


  error:   (message) -> @create message, "error"
  success: (message) -> @create message, "success"
  warn:    (message) -> @create message, "warn"


exports.$inject = [
  "$http"
  "$rootScope"
  "$log"
  "$storage"
]