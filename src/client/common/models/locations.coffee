name = "[model:location]"
locations = null


exports = module.exports = ($environment, $http, $log, $storage) -> new class

  ###
    Returns all the locations.
  ###
  getAll: -> locations


  ###
    Returns the location object given it's id.
  ###
  findById: (id) -> for l in locations then if l.id is id then return l


  # Downloads the location, either from the cache or from API
  download: ->
    if locations? then return
    $log.log name, "downloading locations"

    # A helper function to retrieve the locations from the API
    fetchFromAPI = ->
      $log.log name, "fetching locations from API"
      $http.get "#{$environment.url}/api/locations"
      .success (results) ->
        $log.log name, "fetched locations from API"
        $storage.local "models:location", angular.toJson results
        locations = results

    if cache = $storage.local "models:location"
      # locations was found in cache, prepare to translate it and return
      $log.log name, "retrieving locations from cache"
      try locations = angular.fromJson cache
      # Something went wrong while parsing the locations. No problem, we"ll
      # retrieve it from the API.
      catch exception then fetchFromAPI()
    else
      # locations were never saved. So retrieve it from the API.
      $log.log name, "retrieving locations from API"
      fetchFromAPI()


exports.$inject = [
  "$environment"
  "$http"
  "$log"
  "$storage"
]
