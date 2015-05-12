exports = module.exports = ($http, $root, console, $storage) -> new class
  name: "[model:notifications]"

  constructor: -> @notify "Hello"

  # Returns a list of all the notifications
  getAll: ->

  spawn: (message, type="success") ->
    # Broadcast the message first.
    $root.$boradcast "notifications",
      text: message, type: type


exports.$inject = [
  "$http"
  "$rootScope"
  "$log"
  "$storage"
]