# getQueryParameters = (require "../../api/query/helpers").getQueryParameters

exports = module.exports = (renderer, Categories, Classifieds) ->
  controller = (request, response, next) ->
    parameters = {} #getQueryParameters request
    page = 1
    reverse = false


    _renderPage = (title) ->
      Classifieds.query parameters, (error, classifieds) ->
        if error then return next error
        options =
          data: classifieds: classifieds.toJSON()
          page: "classified/search"
          title: title or response.__ "title.classified.search"
        renderer request, response, options, false


    Categories.getAll (error, categories) ->
      if error then next error
      parentCategory = request.params[0]
      childCategory = request.params[1]

      # Query on the parent category based on the first slug
      if parentCategory then for parent in categories
        if parent.slug == parentCategory
          parameters.category = parent.id
          title = parent.name

          # Query on the child category based on the second slug
          if childCategory? then for child in parent.children
            if child.slug == childCategory
              parameters.childCategory = child.id
              title = "#{child.name} - #{parent.name}"

      # Render the page with the resulting query parameters
      _renderPage title


exports["@require"] = [
  "controllers/renderer"
  "models/categories"
  "models/classifieds"
]
exports["@singleton"] = true