exports.up = (knex, Promise) ->
  knex.schema.createTable "sharing_price_types", (table) ->
    table.increments().primary()
    table.string("name").notNull()
    table.string("slug").notNull().unique()


exports.down = (knex, Promise) -> knex.schema.dropTable "sharing_price_types"