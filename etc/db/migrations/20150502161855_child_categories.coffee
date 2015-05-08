exports.up = (knex, Promise) ->
  knex.schema.createTable "child_categories", (table) ->
    table.increments().primary()
    (table.string "name").notNull()
    (table.string "slug").notNull()
    (table.integer "parent_category")

exports.down = (knex, Promise) -> knex.schema.dropTable "child_categories"