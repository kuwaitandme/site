exports = module.exports = (Enum) ->
  class Categories extends Enum
    downloadUrl: -> "/api/news/categories"
    name: "[model:news/categories]"

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



  new Categories


exports.$inject = ["models.base.enum"]
