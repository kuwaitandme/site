exports = module.exports = (Classified, Categories, cache) ->
  controller = (request, response, next) ->
    response.contentType "application/json"

    _getAll = ->
      # Check in cache
      cache.get "categories", (error, results) =>
        if results then return response.end results

        # Categories was not cached, so query and then save in cache
        new Categories().fetch().then (collection) ->
          results = []
          for category in collection.toJSON()
            if not category.parent_category?
              category.children = []
              results.push category
            else
              for parentCategory in results
                if parentCategory.id is category.parent_category
                  parentCategory.children.push category
                  break

          json = JSON.stringify results
          cache.set "categories", json
          response.end json

    _getCounters = -> response.end '{}'

    if request.query.count then _getCounters()
    else _getAll()


exports["@require"] = [
  "models/classified"
  "models/categories"
  "controllers/cache"
]
exports["@singleton"] = true