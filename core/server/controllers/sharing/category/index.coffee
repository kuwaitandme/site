exports = module.exports = (Stories) ->
  # routes: [
  #   "/category/[a-z\-]+-([0-9]+)"
  #   "/category/[a-z\-]+-([0-9]+)/page/([0-9]+)"
  # ]

  # controller: (request, response, next) ->
  #   #! Get the knex instance
  #   knex = Stories.knex

  #   categoryID = request.params[0]

  #   #! This querybuilder fn will allow us to make a custom query
  #   buildQuery = (qb) ->
  #     #! Build the subquery. Here we select only story id that have the given
  #     #! category.
  #     subquery = knex.select "story"
  #       .from "news_story_category"
  #       .where "category", categoryID
  #     qb.where "id", "in", subquery

  #   #! Now query for the top stories using our custom querybuilder fn.
  #   Stories.top buildQuery, page: request.params[1] or 1
  #   .then (stories) ->

  #     # TODO find some other way for this..
  #     stories.collection = stories.collection.toJSON()
  #     for story in stories.collection
  #       delete story.created_by.password
  #       delete story.created_by.rss_token
  #       delete story.created_by.mailing_list_token

  #     response.render "main/news/categories",
  #       metaRobots: "noarchive"
  #       cache:
  #         suffix: categoryID
  #         enable: true
  #         timeout: 60 * 10 # 10 minute cache
  #       data: stories
  #       title: null

  #   .catch (e) -> next e


exports["@require"] = ["models/sharing/items"]
exports["@singleton"] = true