exports = module.exports = ($http, $root, console, $storage) -> new class
  name: "[service:notifications]"

  constructor: ->
    console.log @name, "initializing"

  # Returns a list of all the notifications
  getAll: ->

  create: (message, type="success") ->
    # Broadcast the message first.
    $root.$broadcast "notification",
      text: message, type: type


exports.$inject = [
  "$http"
  "$rootScope"
  "$log"
  "$storage"
]