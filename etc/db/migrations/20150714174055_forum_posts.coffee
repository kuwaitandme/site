exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_posts", (table) ->
    table.increments().primary()
    table.integer("topic").notNull().references("id").inTable "forum_topics"
    table.integer("created_by").notNull().references("id").inTable "users"
    table.integer("edited_by").references("id").inTable "users"
    table.text("content").notNull()
    table.string("excerpt").notNull().defaultTo ""
    table.boolean("is_banned").defaultTo false
    table.integer("votes").notNull().defaultTo 0
    table.decimal("hotness", 20, 10).index().notNull().defaultTo 0.0
    table.json("meta").defaultTo "{}"
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"

exports.down = (knex, Promise) -> knex.schema.dropTable "forum_posts"
