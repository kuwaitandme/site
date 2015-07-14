exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_category_statuses", (table) ->
    table.increments().primary()
    table.string("name").notNull()
    table.string("slug").notNull().unique()


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_category_statuses"
