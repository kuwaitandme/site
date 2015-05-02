exports.up = (knex, Promise) ->
  knex.schema.createTable "categories", (table) ->
    table.increments().primary()
    (table.string "name").notNull()
    (table.string "slug").notNull()
    (table.integer "parent_category").references("id").inTable "categories"

exports.down = (knex, Promise) -> knex.schema.dropTable "categories"