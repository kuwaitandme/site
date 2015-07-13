exports = module.exports = (renderer, Categories, Classifieds) ->
  controller = (request, response, next) ->
    # First get all the categories (which also gets cached! so should barely
    # take any time...)
    Categories.getAll()
    .then (categories) ->
      options =
        cache:
          key: "route:/classified"
        data:
          categories: categories
        page: "classified/categories"
        title: response.__ "title.classified.search"

      [request, response, options]
    # Then render the page, using a cache with an Infinite lifetime..
    .spread renderer

    # Pass any errors to the handlers
    .catch next


exports["@require"] = [
  "controllers/renderer"
  "models/categories"
  "models/classifieds"
]
exports["@singleton"] = true
