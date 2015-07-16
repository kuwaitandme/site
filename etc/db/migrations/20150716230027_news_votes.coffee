exports.up = (knex, Promise) ->
  knex.schema.createTable "news_votes", (table) ->
    table.increments().primary()
    table.integer("user").notNull().references("id").inTable "users"
    table.integer("story").notNull().references("id").inTable "news_stories"
    table.integer("comment").references("id").inTable "comments"
    table.boolean("is_upvote").notNull()
    table.boolean("is_media").notNull().defaultTo false
    table.boolean("inactive").notNull().defaultTo false
    table.string("reason", 1)
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"
    table.unique ["comment", "user"]
    table.unique ["story", "user"]

exports.down = (knex, Promise) -> knex.schema.dropTable "news_votes"
