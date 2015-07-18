exports.seed = (knex, Promise) ->
  story_category =
    category: 1
    story: 1
    id: 1

  knex("news_story_category").insert story_category
