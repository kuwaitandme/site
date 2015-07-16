exports.up = (knex, Promise) ->
  knex.schema.createTable "news_story_category", (table) ->
    table.increments().primary()
    table.integer("category").notNull().references("id").inTable "news_categories"
    table.integer("story").notNull().references("id").inTable "news_stories"
    table.unique ["category", "story"]

exports.down = (knex, Promise) -> knex.schema.dropTable "news_story_category"
