exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_groups", (table) ->
    table.increments().primary()
    table.string("description").notNull()
    table.string("name").notNull()
    table.string("slug").notNull().unique()
    table.integer("status").notNull().references("id").inTable "forum_group_statuses"
    table.json("meta").defaultTo "{}"
    table.timestamps()


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_groups"
