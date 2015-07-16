exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_topics", (table) ->
    table.increments().primary()
    table.text("content").notNull()
    table.string("title").notNull()
    table.string("slug").notNull()
    table.string("excerpt").notNull()
    table.integer("forum_category").notNull().references("id").inTable "forum_categories"
    table.integer("created_by").notNull().references("id").inTable "users"
    table.integer("updated_by").references("id").inTable "users"
    table.integer("status").notNull().references("id").inTable "forum_topic_statuses"
    table.integer("view_count").notNull().defaultTo 0
    table.integer("votes").notNull().defaultTo 0
    table.integer("language").notNull().references("id").inTable "languages"
    table.integer("reputation").notNull().defaultTo 0
    table.integer("edited").notNull().defaultTo 0
    table.json("meta")
    table.timestamps()


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_topics"
