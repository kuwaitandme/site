exports = module.exports = ($http, $log, $storage) -> new class
  name: "[model:category]"

  ###
  ## *getAll(callback):*
  This function returns an array of all the categories from the server. The
  callback function follows a node-style pattern and should look something like
  this.

    callback = function(error, categories) { LOGIC HERE };

  ###
  getAll: (callback) -> @categories


  findBySlug: (slug) ->
    for cat in @categories
      if cat.slug is slug then return cat

      if cat.children? then for childcat in cat.children
        if childcat.slug is slug then return childcat
    {}


  findById: (id) ->
    for cat in @categories
      if cat.id is id then return cat
      if cat.children? then for childcat in cat.children
        if childcat.id is id then return childcat
    {}


  setCounters: (counters) ->
    for category in (@categories or [])
      category.count = 0
      for categoryCount in (counters.category or [])
        if categoryCount._id is category._id
          category.count = categoryCount.total
          break

      for childCategory in (category.children or [])
        childCategory.count = 0
        for categoryCount in (counters.childCategory or [])
          if categoryCount._id is childCategory._id
            childCategory.count = categoryCount.total
            break

  # Downloads the categories either from the API or from the cache
  download: ->
    if @categories? then return
    $log.log @name, "downloading categories"

    _getCounters = (callback=->) =>
      $log.log @name, "fetching category counters"
      $http.get "/api/category?count=true"
      .success (response) =>
        $log.log @name, "fetched category counters"
        $log.debug @name, response
        @setCounters response
        callback null, response
      .error (response) =>
        callback response
        $log.error @name, "error fetching category counters"
        $log.error @name, response

    # A helper function to retrieve the categories from the API
    _fetchFromAPI = =>
      $http.get "/api/category/"
      .success (categories) =>
        $log.log @name, "fetched categories from API"
        @categories = categories
        $storage.local "models:category", angular.toJson categories

    cache = $storage.local "models:category"
    if cache? and false
      # Categories was found in cache, prepare to translate it and return
      $log.log @name, "fetching categories from cache"
      try
        @categories = angular.fromJson cache
        _getCounters()
        $log.log @name, "fetched categories from cache"
      catch exception
        # Something went wrong while parsing the categories. No problem, we'll
        # retrieve it from the API.
        $log.error @name, "can't parse categories from cache"
        _fetchFromAPI().then -> _getCounters()
    else
      # Categories were never saved. So retrieve it from the API.
      $log.log @name, "fetching categories from API"
      _fetchFromAPI().then -> _getCounters()


exports.$inject = [
  "$http"
  "$log"
  "$storage"
]