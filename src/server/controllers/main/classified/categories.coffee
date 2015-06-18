# getQueryParameters = (require "../../api/query/helpers").getQueryParameters

exports = module.exports = (renderer, Categories, Classifieds) ->
  controller = (request, response, next) ->
    page = 1
    reverse = false
    title = null

    parentCategory = request.params[0]
    childCategory = request.params[1]

    Categories.getAll()
    .then (categories) ->
      options =
        data: categories: categories
        page: "classified/categories"
        title: response.__ "title.classified.search"
      renderer request, response, options, false

    .catch (error) -> next error


exports["@require"] = [
  "controllers/renderer"
  "models/categories"
  "models/classifieds"
]
exports["@singleton"] = true
