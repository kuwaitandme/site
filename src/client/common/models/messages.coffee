name = "[model:messages]"


exports = module.exports = ($environment, $http, $log, $storage) ->
  route = "#{$environment.url}/api/messages"
  new class Model

    types:
      CLASSIFIED: 0
      WEBMASTER: 1

    create: (data={}, type=0) ->
      switch type
        when @types.CLASSIFIED
          url = "#{route}/classified/#{data.id}"
        when @types.WEBMASTER then url = "#{route}/webmaster"

      $http
        data: data
        method: "POST"
        url: url
      .then (response) -> console.log response


    ###
      Find the child category with the given id.
    ###
    findByChildId: (id) ->
      for c1 in @getAll() then if c1.children? then for c2 in c1.children
        if c2.id is id then return c2



    ###
      Download all the categories either from the API or from the cache
    ###
    download: ->
      # If categories were already downloaded, then this variable would be
      # defined, so we simply return..
      if categories.length > 0 then return

      # Now we prepare to download the categories
      $log.log name, "downloading categories"

      # Category counter are not cached because they change regularly, so we
      # send an API call to the server to fetch them.
      getCounters = ->
        $log.log name, "fetching category counters"
        $http.get "#{$environment.url}/api/categories/counters"
        .success (response) ->
          $log.log name, "fetched category counters"
          $log.debug name, response
          _setCounters response
        .error (response) ->
          $log.error name, "error fetching category counters"
          $log.error name, response

      # A helper function to retrieve the categories from the API
      fetchFromAPI = ->
        $http.get "#{$environment.url}/api/categories/"
        .success (result) ->
          $log.log name, "fetched categories from API"
          categories = result
          console.log categories
          $storage.local "models:category", angular.toJson result

      # Check in cache
      if cache = $storage.local "models:category"
        # Categories was found in cache, prepare to translate it and return
        $log.log name, "fetching categories from cache"
        try
          categories = angular.fromJson cache
          $log.log name, "fetched categories from cache"
        catch exception
          # Something went wrong while parsing the categories. No problem, we'll
          # retrieve it from the API.
          $log.error name, "can't parse categories from cache"
          fetchFromAPI()
      else
        # Categories were never saved. So retrieve it from the API.
        $log.log name, "fetching categories from API"
        fetchFromAPI()
      getCounters()


exports.$inject = [
  "$environment"
  "$http"
  "$log"
  "$storage"
]
