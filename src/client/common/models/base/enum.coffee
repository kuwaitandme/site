exports = module.exports = ($environment, $http, $log, $storage, $q) ->
  class Enum
    name: "[enum]"
    cache: true
    _downloadedFlag: false

    downloadUrl: -> ""


    getAll: -> @data


    get: (key) -> @data[key]


    findById: (id) -> for obj in @data then if obj._id is id then return obj


    download: ->
      if @_downloadedFlag then return

      url = @downloadUrl()
      cacheKey = "enum:#{url}"

      $log.debug @name, "downloading from", url

      # Now check for the data in cache if it exists
      $storage.local cacheKey
      .then (cache) =>
        $log.log @name, "retrieved from cache"

        $q (resolve, reject) =>
          if @cache and cache?
            # data was found in cache, prepare to parse it and return
            $log.log @name, "parsing from cache"
            resolve @data = angular.fromJson cache
          else reject "couldn't parse from cache"

      # Something went wrong while parsing the cached data or there was nothing
      # in the cache. No problem, we'll retrieve it from the API.
      .catch =>
        $log.log @name, "retrieving from API"
        $http.get "#{$environment.url}#{url}"
        .success (@data) => $storage.local cacheKey, angular.toJson @data
      .then =>
        @_downloadedFlag = true
        $log.log @name, "downloaded"




exports.$inject = [
  "$environment"
  "$http"
  "$log"
  "$storage"
  "$q"
]
