exports.up = (knex, Promise) ->
  knex.schema.createTable "parent_categories", (table) ->
    table.increments().primary()
    (table.string "name").notNull()
    (table.string "slug").notNull()

exports.down = (knex, Promise) -> knex.schema.dropTable "parent_categories"