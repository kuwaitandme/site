class Notification extends require "./default"
  isSaved: -> @data.id?

  # To check for delivery status
  hasRead: -> @data.hasRead is 1

name = "[model:notifications]"
exports = module.exports = ($environment, $http, $serialize, $location, $log, $root) ->
  APIurl = "#{$environment.url}/api/notifications"

  notifications = []
  readSentToAPI = false
  downloaded = false

  new class Model
    constructor: ->
      $log.log name, "initializing"
      $root.$on "notifications:refresh", -> readSentToAPI = false

    add: (data) ->
      notification = new Notification data
      notifications.push notification
      $root.$emit "notifications:add", notification
      $root.$emit "notifications:refresh", notifications

    download: ->
      if downloaded then return
      downloaded = true
      $log.log name, "downloading notifications"
      $http.get APIurl
      .then (response) ->
        notifications = response.data
        $log.debug name, "got #{notifications.length} notifications"
        notifications = do -> new Notification n for n in notifications
        $root.$emit "notifications:refresh", notifications


    signalRead: ->
      if readSentToAPI then return
      readSentToAPI = true
      $http.get "#{APIurl}/read"
      # .then (response) -> $root.$emit "notifications:refresh", notifications


    getAll: -> notifications


exports.$inject = [
  "$environment"
  "$http"
  "$httpParamSerializer"
  "$location"
  "$log"
  "$rootScope"
]
