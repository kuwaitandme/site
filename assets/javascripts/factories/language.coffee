module.exports = ($http, $cache) ->
  class Model
    name: "[service:language]"

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


    download: ->
      if @categories? then return

      console.log @name, 'downloading categories'
      cache = $cache.get 'models:category'
      # A helper function to retrieve the categories from the API
      _fetchFromAPI = =>
        $http.get "/api/category/"
        .success (categories) =>
          @categories = categories
          $cache.set 'models:category', JSON.stringify categories

      if cache?
        # Categories was found in cache, prepare to translate it and return
        console.log @name, 'retrieving categories from cache'
        try
          @categories = JSON.parse cache
        catch exception
          # Something went wrong while parsing the categories. No problem, we'll
          # retrieve it from the API.
          _fetchFromAPI()
      else
        # Categories were never saved. So retrieve it from the API.
        console.log @name, 'retrieving categories from API'
        _fetchFromAPI()
  new Model