name = "[service:notifications]"
exports = module.exports = ($http, $log, $location, $notifications, $storage, $timeout, Users, Languages) -> new class
  constructor: -> $log.log name, "initializing"

  # Returns a list of all the notifications
  getAll: ->


  _create: (message, type="success", timeout=5000) ->
    $notifications.add
      flash: true
      hasRead: false
      message: message
      timeout: timeout
      type: type


  _translate: (token) ->
    currentUser = Users.getCurrent() or {}
    currentUserName = currentUser.get().full_name or ""
    message = Languages.translate token
    message.replace "_NAME_", currentUserName


  error: (message, timeout) -> @_create message, "error", timeout
  success: (message, timeout) -> @_create message, "success", timeout
  warn: (message, timeout) -> @_create message, "warn", timeout

  parseURL: ->
    $log.log name, "parsing URL"
    query = $location.search()
    if query._success? then @success @_translate query._success
    if query._error? then @error @_translate query._error
    if query._warn? then @warn @_translate query._warn
    $timeout ->
      $location.search "_error", null
      $location.search "_success", null
      $location.search "_warn", null
    , 1000


exports.$inject = [
  "$http"
  "$log"
  "$location"
  "models.notifications"
  "$storage"
  "$timeout"

  "models.users"
  "models.languages"
]
