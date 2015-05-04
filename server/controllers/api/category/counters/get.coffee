exports = module.exports = (Classified, Categories, cache) ->
  controller = (request, response, next) ->
    response.contentType "application/json"

      # # Check in cache
      # cache.get "route:api/categories/counters", (error, results) =>
      #   if results then return response.end results

      #   # Categories was not cached, so query and then save in cache
      #   Categories.getAll (error, categories) ->
      #     results = []
      #     for category in categories
      #       if not category.parent_category?
      #         category.children = []
      #         results.push category
      #       else
      #         for parentCategory in results
      #           if parentCategory.id is category.parent_category
      #             parentCategory.children.push category
      #             break

      #     json = JSON.stringify results, null, 2
      #     cache.set "route:api/categories/counters", json
      #     response.end json

    response.end "{}"


exports["@singleton"] = true
exports["@require"] = [
  "models/categories"
  "controllers/cache"
]