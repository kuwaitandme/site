name = "[model:category]"
categories = null

# This function properly sets the category counter to each category
_setCounters = (counters) ->
  for parentCategory in (categories or [])
    parentCategory.count = 0
    for categoryCount in (counters.parent_category or [])
      if categoryCount.id is parentCategory.id
        parentCategory.count = categoryCount.count
        break

    for childCategory in (parentCategory.children or [])
      childCategory.count = 0
      for categoryCount in (counters.child_category or [])
        if categoryCount.id is childCategory.id
          childCategory.count = categoryCount.count
          break


exports = module.exports = ($environment, $http, $log, $storage) -> new class
  ###
    This function returns an array of all the categories from the server.
  ###
  getAll: (callback) -> categories


  ###
    This function returns the category (child or parent) given only it's slug.
    For this function to work flawlessly, it assumes that all slugs (both
    parent and child combined) are unique.
  ###
  findBySlug: (slug) ->
    for cat in categories
      # Compare with the parent
      if cat.slug is slug then return cat
      # If parent didn't match then try with each of the child categories
      if cat.children? then for childcat in cat.children
        if childcat.slug is slug then return childcat


  ###
    Find the parent category with the given id.
  ###
  findByParentId: (id) -> for c in categories then if c.id is id then return c


  ###
    Find the child category with the given id.
  ###
  findByChildId: (id) ->
    for c1 in categories then if c1.children? then for c2 in c1.children
      if c2.id is id then return c2



  ###
    Download all the categories either from the API or from the cache
  ###
  download: ->
    # If categories were already downloaded, then this variable would be
    # defined, so we simply return..
    if categories? then return

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
