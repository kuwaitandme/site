exports = module.exports = ($http, $cache) ->
  class Model
    name: "[model:location]"


    getAll: (callback) -> @locations


    findById: (id) ->
      for location in @locations
        if location.id is id then return location
      {}


    download: ->
      # A helper function to retrieve the locations from the API
      _fetchFromAPI = =>
        console.log @name, "fetching locations from API"
        $http.get "/api/location"
        .success (locations) =>
          console.log @name, "fetched locations from API"
          @locations = locations
          $cache.set "models:location", angular.toJson locations

      if @locations? then return

      console.log @name, "downloading locations"
      cache = $cache.get "models:location"


      if cache?
        # locations was found in cache, prepare to translate it and return
        console.log @name, "retrieving locations from cache"
        try
          @locations = angular.fromJson cache
          _getCounters()
        catch exception
          # Something went wrong while parsing the locations. No problem, we"ll
          # retrieve it from the API.
          _fetchFromAPI()
      else
        # locations were never saved. So retrieve it from the API.
        console.log @name, "retrieving locations from API"
        _fetchFromAPI()

  new Model


exports.$inject = [
  "$http"
  "$cache"
]