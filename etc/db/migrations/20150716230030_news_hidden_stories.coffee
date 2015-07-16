exports.up = (knex, Promise) ->
  knex.schema.createTable "news_hidden_stories", (table) ->
    table.increments().primary()
    table.integer("story").notNull().references("id").inTable "news_stories"
    table.integer("user").notNull().references("id").inTable "users"
    table.unique ["story", "user"]

exports.down = (knex, Promise) -> knex.schema.dropTable "news_hidden_stories"
