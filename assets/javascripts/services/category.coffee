module.exports = ($http, $cache) ->
  name: "[model:category]"

  ###
  ## *getAll(callback):*
  This function returns an array of all the categories from the server. The
  callback function follows a node-style pattern and should look something like
  this.

    callback = function(error, categories) { LOGIC HERE };

  ###
  getAll: (callback) ->
    cache = $cache.get 'models:category'

    # A helper function to retrieve the categories from the API
    _fetchFromAPI = ->
      $http.get "/api/category/"
      .success (categories) ->
        $cache.set 'models:category', JSON.stringify categories
        callback null, categories

    if cache?
      # Categories was found in cache, prepare to translate it and return
      console.log @name, 'retrieving categories from cache'
      try callback null, JSON.parse cache
      catch exception
        # Something went wrong while parsing the categories. No problem, we'll
        # retrieve it from the API.
        _fetchFromAPI()
    else
      # Categories were never saved. So retrieve it from the API.
      console.log @name, 'retrieving categories from API'
      _fetchFromAPI()