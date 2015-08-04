exports = module.exports = (Renderer, Stories) ->
  controller = (request, response, next) ->
    Stories.recent(page: request.params[0] or 1).then (stories) ->

      # TODO find some other way for this..
      stories.collection = stories.collection.toJSON()
      for story in stories.collection
        delete story.created_by.password
        delete story.created_by.rss_token
        delete story.created_by.mailing_list_token

      options =
        page: "news/recent"
        data: stories
      Renderer request, response, options
    .catch (e) -> next e


exports["@require"] = [
  "libraries/renderer"
  "models/news/stories"
]
exports["@singleton"] = true
