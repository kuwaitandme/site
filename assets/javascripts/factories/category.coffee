exports = module.exports = ($http, $cache) ->
  class Model
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
        for childcat in cat.children
          if childcat.slug is slug then return childcat
      {}


    findById: (id) ->
      for cat in @categories
        if cat._id is id then return cat
        for childcat in cat.children
          if childcat._id is id then return childcat
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


    download: ->
      _getCounters = (callback=->) =>
        console.log @name, 'fetching category counters'
        $http.get '/api/category?count=true'
        .success (response) =>
          console.log @name, 'fetched category counters'
          @setCounters response
          callback null, response
        .error (response) =>
          console.error @name, 'error fetching category counters', response
          callback response

      # A helper function to retrieve the categories from the API
      _fetchFromAPI = =>
        console.log @name, 'fetching categories from API'
        $http.get "/api/category/"
        .success (categories) =>
          console.log @name, 'fetched categories from API'
          @categories = categories
          $cache.set 'models:category', JSON.stringify categories

      if @categories? then return

      console.log @name, 'downloading categories'
      cache = $cache.get 'models:category'


      if cache?
        # Categories was found in cache, prepare to translate it and return
        console.log @name, 'retrieving categories from cache'
        try
          @categories = JSON.parse cache
          _getCounters()
        catch exception
          # Something went wrong while parsing the categories. No problem, we'll
          # retrieve it from the API.
          _fetchFromAPI().then -> _getCounters()
      else
        # Categories were never saved. So retrieve it from the API.
        console.log @name, 'retrieving categories from API'
        _fetchFromAPI().then -> _getCounters()

  new Model


exports.$inject = [
  '$http'
  '$cache'
]