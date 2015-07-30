exports.seed = (knex, Promise) ->
  knex("news_story_category").insert category: 1, story: 1
  .then -> knex("news_story_category").insert category: 2, story: 1
  .then -> knex("news_story_category").insert category: 3, story: 1
  .then -> knex("news_story_category").insert category: 2, story: 2
  .then -> knex("news_story_category").insert category: 1, story: 3
