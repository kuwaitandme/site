exports.up = (knex, Promise) ->
  knex.schema.createTable "news_moderations", (table) ->
    table.increments().primary()
    table.integer("user").references("id").inTable "users"
    table.integer("moderator").references("id").inTable "users"
    table.integer("story").references("id").inTable "news_stories"
    table.integer("comment").references("id").inTable "comments"
    table.string("reason")
    table.string("action")
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"


exports.down = (knex, Promise) -> knex.schema.dropTable "news_moderations"
