Model = ($http, Enum) ->
  new class Categories extends Enum
    downloadUrl: -> "/api/sharing/categories"
    tag: "model:sharing/categories"
    md5Key: "model:sharing_categories"

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


    getCounters: ->
      $http.get @url "/counters"
      .then (response) ->
        counters = response.data
        counter.stories = Number counter.stories for counter in counters
        counters


Model.$inject = [
  "$http"
  "@models/base/enum",
]
module.exports = Model