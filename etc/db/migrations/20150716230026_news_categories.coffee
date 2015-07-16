exports.up = (knex, Promise) ->
  knex.schema.createTable "news_categories", (table) ->
    table.increments().primary()
    table.string("title", 25).unique().index().notNull().defaultTo ""
    table.string("description", 100)
    table.boolean("is_media").defaultTo false
    table.boolean("inactive").defaultTo false
    table.integer("hotness_mod").defaultTo 0
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"


exports.down = (knex, Promise) -> knex.schema.dropTable "news_categories"
