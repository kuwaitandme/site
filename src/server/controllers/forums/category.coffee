exports = module.exports = (Renderer, Categories, Topics, Users) ->
  controller = (request, response, next) ->
    data = {}

    Categories.getBySlug(request.params[0]).then (category) ->
      data.category = category
      Topics.getLatestByCategory category.id
    .then (topics) ->
      topics.collection = topics.collection.toJSON()

      # TODO find some other way for this..
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
    .catch (e) ->
      console.error e
      next e


exports["@require"] = [
  "libraries/renderer"
  "models/forums/categories"
  "models/forums/topics"
]
exports["@singleton"] = true
