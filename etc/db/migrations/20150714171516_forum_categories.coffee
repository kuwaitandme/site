exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_categories", (table) ->
    table.increments().primary()
    table.string("description").notNull()
    table.string("name").notNull()
    table.string("slug").notNull().unique()
    table.integer("parent").references("id").inTable "forum_categories"
    table.integer("status").notNull().references("id").inTable "forum_category_statuses"
    table.json("meta").defaultTo "{}"


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_categories"
