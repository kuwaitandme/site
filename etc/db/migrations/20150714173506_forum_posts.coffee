exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_posts", (table) ->
    table.increments().primary()
    table.text("content").notNull()
    table.string("name").notNull()
    table.string("slug").notNull()
    table.integer("forum_category").references("id").inTable "forum_categories"
    table.integer("user").references("id").inTable "users"
    table.integer("status").notNull().references("id").inTable "forum_post_statuses"
    table.integer("view_count").notNull().defaultTo 0
    table.integer("votes").notNull().defaultTo 0
    table.integer("language").notNull().references("id").inTable "languages"
    table.integer("reputation").notNull().defaultTo 0
    table.integer("edited").notNull().defaultTo 0
    table.json("meta")
    table.timestamps()


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_posts"
