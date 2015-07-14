exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_tags", (table) ->
    table.increments().primary()
    table.string("name").notNull().unique()
    table.string("slug").notNull().unique()
    table.timestamps()


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_tags"
