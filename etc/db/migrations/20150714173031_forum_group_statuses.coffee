exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_group_statuses", (table) ->
    table.increments().primary()
    table.string("name").notNull()
    table.string("slug").notNull().unique()


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_group_statuses"