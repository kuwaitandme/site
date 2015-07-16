exports.up = (knex, Promise) ->
  knex.schema.createTable "news_stories", (table) ->
    table.increments().primary()
    table.string("title", 150).notNull().defaultTo ""
    table.text("description")
    table.text("description_markdown")
    table.text("short_id", 6).index().notNull().defaultTo ""
    table.string("url", 250).index().defaultTo ""
    table.integer("upvotes").notNull().defaultTo 0
    table.integer("downvotes").notNull().defaultTo 0
    table.decimal("hotness", 20, 10).index().notNull().defaultTo 0.0
    table.boolean("is_expired").defaultTo false
    table.boolean("is_moderated").defaultTo false
    table.integer("merged_story").index().notNull().references("id").inTable "news_stories"
    table.text("story_cache")
    table.json("meta").defaultTo "{}"
    table.integer("created_by").notNull().references("id").inTable "users"
    table.integer("updated_by").references("id").inTable "users"
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"
    # table.unique ["is_expired", "is_moderated"]

exports.down = (knex, Promise) -> knex.schema.dropTable "news_stories"
