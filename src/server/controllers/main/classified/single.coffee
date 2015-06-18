async     = require "async"
validator = require "validator"

exports = module.exports = (renderer, Classified) ->
  controller = (request, response, next) ->
    Classified.getBySlug request.params[0]
    .then (results) ->
      # Display 404 page if classified is not found
      if not results? then return next()

      # Start parsing out the classified's data
      classified = results.toJSON()
      if not classified.id? then return next()
      if classified.meta? then noIndex = classified.meta.robotsNoIndex

      # Render the page!
      options =
        data:
          noIndex: noIndex or false
          classified: classified
        description: classified.description
        page: "classified/single"
        title: classified.title
      renderer request, response, options, false
    .catch (error) -> next error


exports["@require"] = [
  "controllers/renderer"
  "models/classifieds"
]
exports["@singleton"] = true
