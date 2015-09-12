Model = ($http, $log, $q, Environment, Storage) ->
  class Enum
    tag: "enum"
    cache: true
    md5Key: "insert-md5-key"
    _downloadedFlag: false

    constructor: ->
      @logger = $log.init @tag
      @logger.log "initializing"


    downloadUrl: -> ""
    url: (path="") -> "#{Environment.url}#{@downloadUrl()}#{path}"


    getAll: -> @data


    get: (key) -> @data[key]


    findById: (id) -> for obj in @data then if obj.id is id then return obj


    onChange: -> null


    download: ->
      if @_downloadedFlag then return

      url = @downloadUrl()
      cacheKey = "enum:#{url}"
      md5CacheKey = "md5:#{@md5Key}"

      @logger.debug "downloading from", url

      Storage.local(md5CacheKey).then (md5Hash) =>
        #! If the md5 key changes then we clear the cache so that it reloads
        if md5Hash != Environment.md5[@md5Key]
          @logger.log "local md5 hash is different; flushing cache"
          Storage.local cacheKey, null
        else @logger.log "local md5 hash is the same; not flushing cache"

        #! Now check for the data in cache if it exists
        Storage.local cacheKey

      .then (cache) =>
        @logger.log "retrieved from cache"


        $q (resolve, reject) =>
          if @cache and cache?
            # data was found in cache, prepare to parse it and return
            @logger.log "parsing from cache"
            resolve @data = angular.fromJson cache
          else reject "couldn't parse from cache"

      # Something went wrong while parsing the cached data or there was nothing
      # in the cache. No problem, we'll retrieve it from the API.
      .catch (error) =>
        @logger.log "retrieving from API"
        $http.get @url()
        .success (@data) =>
          Storage.local md5CacheKey, Environment.md5[@md5Key]
          Storage.local cacheKey, angular.toJson @data

      .then (data) =>
        @_downloadedFlag = true
        @onChange @date
        @logger.log "downloaded"




Model.$inject = [
  "$http"
  "$log"
  "$q"
  "@environment"
  "@storage"
]

module.exports = Model