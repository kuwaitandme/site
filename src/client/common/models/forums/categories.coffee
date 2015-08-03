name = "[model:forums/categories]"
categories = []


exports = module.exports = ($environment, $http, $log, $storage) ->
  new class Model
    constructor: -> @download()
    ###
      This function returns an array of all the categories from the server.
    ###
    getAll: (callback) -> categories or []


    ###
      This function returns the category (child or parent) given only it's slug.
      For this function to work flawlessly, it assumes that all slugs (both
      parent and child combined) are unique.
    ###
    findBySlug: (slug) ->
      for cat in @getAll()
        # Compare with the parent
        if cat.slug is slug then return cat
        # If parent didn't match then try with each of the child categories
        if cat.children? then for childcat in cat.children
          if childcat.slug is slug then return childcat


    ###
      Find the parent category with the given id.
    ###
    findByParentId: (id) -> for c in @getAll() then if c.id is id then return c


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

      # A helper function to retrieve the categories from the API
      $http.get "#{$environment.url}/api/forums/categories/"
      .success (result) ->
        $log.log name, "fetched forums/categories from API"
        categories = result
        $storage.local "models:category", angular.toJson result



exports.$inject = [
  "$environment"
  "$http"
  "$log"
  "$storage"
]
