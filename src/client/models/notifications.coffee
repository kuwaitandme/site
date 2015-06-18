class Notification extends require "./default"
  isSaved: -> @data.id?

  # To check for delivery status
  hasRead: -> @data.hasRead is 1


exports = module.exports = ($environment, $http, $serialize, $location, $log, $root) ->
  name = "[model:notifications]"
  APIurl = "#{$environment.url}/api/notifications"

  notifications = []

  class Model
    constructor: ->
      $log.log name, "initializing"
      $root.$on "socket:notification", -> @download()

    download: ->
      $log.log name, "downloading notifications"
      $http.get APIurl
      .then (response) ->
        notifications = response.data
        $log.debug name, "got #{notifications.length} notifications"
        notifications = do -> new Notification n for n in notifications
        $root.$emit "notifications:refresh"
      # .then (@notifications) =>
      #   console.log notifications

    getAll: -> notifications



  new Model


exports.$inject = [
  "$environment"
  "$http"
  "$httpParamSerializer"
  "$location"
  "$log"
  "$rootScope"
]
