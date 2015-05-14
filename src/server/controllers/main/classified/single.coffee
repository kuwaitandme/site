async     = require "async"
validator = require "validator"

exports = module.exports = (renderer, Classified) ->
  controller = (request, response, next) ->
    slug = request.params[0]

    # Update the view counter asynchronously
    # controller.updateViewCount request, id

    Classified.query { slug: slug }, (error, classified) ->
      # response.end JSON.stringify classified

      # Display 404 page if classified is not found
      if not classified then return next()

      options =
        data: classified: classified
        description: classified.title
        page: "classified/single"
        title: classified.title
      renderer request, response, options, false

    # Get the classified
    # Classified.get id, (error, classified) ->
    #   if error then return next error



  # # Helper function to asynchronously update the view counter.
  # #
  # # This function does not take into consideration any errors that might
  # # happen with updating the view counter, because the view count is not a
  # # component that needs much attention or resources.
  # updateViewCount: (request, id) ->
  #   updateTask = (finish) ->
  #     # Get the views object from the session
  #     views = request.session.views
  #     if not views? then views = request.session.views = {}

  #     # Check if the user has visited this classified before
  #     if not views[id]?

  #       # If not, then increment the session counter by 1
  #       classified = global.models.classified
  #       classified.incrementViewCounter id

  #       # Let session know that the user has visited this page
  #       views[id] = true

  #     # Tell async that we are done
  #     finish null, null

  #   # call the update task function through async
  #   async.series [ updateTask ]
  #   options =
  #     page: "classified/finish"
  #     title: response.__ "title.classified.finish"

exports["@require"] = [
  "controllers/renderer"
  "models/classifieds"
]
exports["@singleton"] = true