exports = module.exports = (Renderer, Stories, Comments) ->
  controller = (request, response, next) ->
    data = {}

    slug = request.params[0]

    # First get the story by the slug
    Stories.getBySlug slug, withRelated: ["created_by", "categories"]
    .then (story) ->
      # Using a string to decide 404s is probably inefficient. FIX THIS.
      if not story? then throw new Error "not_found"
      story = story.toJSON()

      # FIX THIS!!
      delete story.created_by.password
      delete story.created_by.mailing_list_token
      delete story.created_by.rss_token
      data.story = story

      # Get a collection of comments for this story. This query will return
      # a set of integer id's, which is okay for us because we expect the client
      # to query the DB via our API to get the comments itself.
      Comments.getByStory story.id
      .then (comments) -> data.comments = comments

    .then ->
      # Render the page
      options =
        page: "info/about"
        title: response.__ "news/single:title"
        data: data
      Renderer request, response, options

    .catch (e) -> if e.message == "not_found" then next() else next(e)


exports["@require"] = [
  "libraries/renderer"
  "models/news/stories"
  "models/news/comments"
]
exports["@singleton"] = true
