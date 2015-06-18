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
      parameters = {}

      if parentCategory
        # Iterate on the parent category based on the first slug
        for parent in categories
          if parent.slug == parentCategory
            parameters.parent_category = parent.id
            title = parent.name
            # Iterate on the child category based on the second slug
            if childCategory?
              for child in parent.children
                if child.slug == childCategory
                  parameters.child_category = child.id
                  title = "#{child.name} - #{parent.name}"
                  break
              if not parameters.child_category then return next()
            break
        if not parameters.parent_category then return next()

      # Once the parameters have been filtered out, we send it to the DB for
      # querying..
      parameters

    # Now using the parameters of the previous promise, we call our model to
    # query on the DB
    .then Classifieds.query
    .then (classifieds) ->
      options =
        data: classifieds: classifieds.toJSON()
        page: "classified/search"
        title: title or response.__ "title.classified.search"
      renderer request, response, options, false

    .catch (error) -> next error


exports["@require"] = [
  "controllers/renderer"
  "models/categories"
  "models/classifieds"
]
exports["@singleton"] = true
