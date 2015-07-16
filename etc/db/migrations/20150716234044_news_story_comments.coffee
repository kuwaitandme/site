exports.up = (knex, Promise) ->
  knex.schema.createTable "news_story_comments", (table) ->
    table.increments().primary()
    table.integer("comment").notNull().references("id").inTable "comments"
    table.integer("story").notNull().references("id").inTable "news_stories"
    table.unique ["story", "comment"]

exports.down = (knex, Promise) -> knex.schema.dropTable "news_story_comments"
