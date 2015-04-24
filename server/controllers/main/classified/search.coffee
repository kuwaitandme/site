getQueryParameters = (require '../../api/query/helpers').getQueryParameters

# Controller for the classified search page. Searches for classifieds with
# some search parameters passed on as GET variables.
controller = module.exports =
  get: (request, response, next) ->
    parameters = getQueryParameters request
    page = 1
    reverse = false

    Category = global.models.category
    Category.getAll (error, categories) ->
      if error then next error

      category = request.params[0]
      childCategory = request.params[1]

      # Query on the parent category based on the first slug
      if category then for cat in categories
        if cat.slug == category
          parameters.category = cat._id
          title = cat.name

          # Query on the child category based on the second slug
          if childCategory then for child in cat.children
            if child.slug == childCategory
              parameters.childCategory = child._id
              title = "#{child.name} - #{cat.name}"

      # Render the page with the resulting query parameters
      renderPage title

    renderPage = (title) ->
      Classified = global.models.classified
      Classified.search parameters, page, reverse, (error, classifieds) ->
        if error then return next error

        args =
          data: classifieds: classifieds
          page: 'classified/search'
          title: title or response.__ 'title.classified.search'

        render = global.modules.renderer
        render request, response, args