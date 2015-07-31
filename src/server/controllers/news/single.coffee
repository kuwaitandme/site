exports = module.exports = (Renderer, Stories, Comments) ->
  controller = (request, response, next) ->
    data = {}

    slug = request.params[0]

    # First get the story by the slug
    Stories.getBySlug slug, withRelated: ["created_by", "categories", "comments"]
    .then (story) ->
      # Using a string to decide 404s is probably inefficient. FIX THIS.
      if not story? then throw new Error "not_found"

      # Load the comments now
      story.related("comments").load "created_by"
      .then (comments) ->
        comments = comments.toJSON()

        # Fix
        for comment in comments
          delete comment.created_by.password
          delete comment.created_by.mailing_list_token
          delete comment.created_by.rss_token

        story.set "comments", comments
        story

    # Once the comments have been loaded too, start rendering the page
    .then (story) ->
      story = story.toJSON()

      # FIX THIS!!
      delete story.created_by.password
      delete story.created_by.mailing_list_token
      delete story.created_by.rss_token

      options =
        page: "info/about"
        title: response.__ "news/single:title"
        data: story: story
      Renderer request, response, options

    .catch (e) -> if e.message == "not_found" then next() else next(e)


exports["@require"] = [
  "libraries/renderer"
  "models/news/stories"
  "models/news/comments"
]
exports["@singleton"] = true
