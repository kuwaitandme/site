exports = module.exports = (Renderer, Categories, Topics, NotFoundError) ->
  controller = (request, response, next) ->
    data = {}

    Categories.getBySlug(request.params[0]).then (category) ->
      if not category? then throw new NotFoundError
      data.category = category
      Topics.getLatestByCategory category.id
    .then (topics) ->

      # TODO find some other way for this..
      topics.collection = topics.collection.toJSON()
      for topic in topics.collection
        delete topic.created_by.password
        delete topic.created_by.rss_token
        delete topic.created_by.mailing_list_token

      data.topics = topics
      args =
        page: "info/about"
        title: response.__ "forums:title"
        data: data
      Renderer request, response, args, true

    .catch (e) -> next e


exports["@require"] = [
  "libraries/renderer"
  "models/forums/categories"
  "models/forums/topics"
  "errors/NotFoundError"
]
exports["@singleton"] = true
