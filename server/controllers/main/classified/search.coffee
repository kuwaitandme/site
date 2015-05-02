# getQueryParameters = (require '../../api/query/helpers').getQueryParameters

exports = module.exports = (renderer, category, classified) ->
  controller = (request, response, next) ->
    parameters = {} #getQueryParameters request
    page = 1
    reverse = false

    _renderPage = (title) ->
      classified.search parameters, page, reverse, (error, classifieds) ->
        if error then return next error
        options =
          data: classifieds: classifieds
          page: 'classified/search'
          title: title or response.__ 'title.classified.search'
        renderer request, response, options, false

    category.getAll (error, result) ->
      if error then next error

      parentCategory = request.params[0]
      childCategory = request.params[1]

      # Query on the parent category based on the first slug
      if parentCategory then for cat in result
        if cat.slug == parentCategory
          parameters.category = cat._id
          title = cat.name

          # Query on the child category based on the second slug
          if childCategory then for child in cat.children
            if child.slug == childCategory
              parameters.childCategory = child._id
              title = "#{child.name} - #{cat.name}"

      # Render the page with the resulting query parameters
      _renderPage title


exports['@require'] = [
  'controllers/renderer'
  'models/categories'
  'models/classified'
]
exports['@singleton'] = true