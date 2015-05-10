exports = module.exports = ($http, console, $storage) -> new class
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


  # This function properly sets the category counter to each category
  _setCounters: (counters) ->
    for category in (@categories or [])
      category.count = 0
      for categoryCount in (counters.parent_category or [])
        if categoryCount.id is category.id
          category.count = categoryCount.count
          break

      for childCategory in (category.children or [])
        childCategory.count = 0
        for categoryCount in (counters.child_categories or [])
          if categoryCount.id is childCategory.id
            childCategory.count = categoryCount.count
            break


  # Downloads the categories either from the API or from the cache
  download: ->
    if @categories? then return
    console.log @name, "downloading categories"

    # Category counter are not cached because they change regularly, so we
    # send an API call to the server to fetch them.
    _getCounters = (callback=->) =>
      console.log @name, "fetching category counters"
      $http.get "/api/category/counters"
      .success (response) =>
        console.log @name, "fetched category counters"
        console.debug @name, response
        @_setCounters response
        callback null, response
      .error (response) =>
        callback response
        console.error @name, "error fetching category counters"
        console.error @name, response

    # A helper function to retrieve the categories from the API
    _fetchFromAPI = =>
      $http.get "/api/category/"
      .success (categories) =>
        console.log @name, "fetched categories from API"
        @categories = categories
        $storage.local "models:category", angular.toJson categories

    # Check in cache
    cache = $storage.local "models:category"
    if cache? and false
      # Categories was found in cache, prepare to translate it and return
      console.log @name, "fetching categories from cache"
      try
        @categories = angular.fromJson cache
        _getCounters()
        console.log @name, "fetched categories from cache"
      catch exception
        # Something went wrong while parsing the categories. No problem, we'll
        # retrieve it from the API.
        console.error @name, "can't parse categories from cache"
        _fetchFromAPI().then -> _getCounters()
    else
      # Categories were never saved. So retrieve it from the API.
      console.log @name, "fetching categories from API"
      _fetchFromAPI().then -> _getCounters()


exports.$inject = [
  "$http"
  "$log"
  "$storage"
]