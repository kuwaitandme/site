SettingsService = ($log, $q, $root, $window, Storage) ->
  logger = $log.init SettingsService.tag

  new class Settings
    current: {}
    storageKey: "settings"

    constructor: ->
      logger.log "initializing"
      Storage.local @storageKey
      .then (settings) => @setAll angular.fromJson(settings) or {}

    get: (key) -> @current[key]
    set: (key, value) ->
      @current[key] = value
      @update()

    getAll: -> @current
    setAll: (@current) ->
      logger.log "set new setting"
      logger.debug @current
      Storage.local @storageKey, angular.toJson @current
      @update()


    update: ->
      logger.log "updating with body classes"
      $root.bodyClasses[s] = @current[s] for s of @current
      $root.$broadcast "settings:change", @current



SettingsService.tag = "service:settings"
SettingsService.$inject = [
  "$log"
  "$q"
  "$rootScope"
  "$window"
  "@storage"
]
module.exports = SettingsService