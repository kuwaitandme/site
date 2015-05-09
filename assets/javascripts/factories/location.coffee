exports = module.exports = ($http, $log, $storage) ->
  class Model
    name: "[model:location]"


    getAll: (callback) -> @locations


    findById: (id) ->
      for location in @locations
        if location.id is id then return location
      {}


    download: ->
      if @locations? then return
      $log.log @name, "downloading locations"

      # A helper function to retrieve the locations from the API
      _fetchFromAPI = =>
        $log.log @name, "fetching locations from API"
        $http.get "/api/location"
        .success (locations) =>
          $log.log @name, "fetched locations from API"
          $log.debug @name, locations
          @locations = locations
          $storage.local "models:location", angular.toJson locations

      cache = $storage.local "models:location"

      if cache? and false
        # locations was found in cache, prepare to translate it and return
        $log.log @name, "retrieving locations from cache"
        try
          @locations = angular.fromJson cache
        catch exception
          # Something went wrong while parsing the locations. No problem, we"ll
          # retrieve it from the API.
          _fetchFromAPI()
      else
        # locations were never saved. So retrieve it from the API.
        $log.log @name, "retrieving locations from API"
        _fetchFromAPI()

  new Model


exports.$inject = [
  "$http"
  "$log"
  "$storage"
]