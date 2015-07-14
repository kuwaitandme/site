exports.up = (knex, Promise) ->
  knex.schema.createTable "locations", (table) ->
    table.increments().primary()
    table.string("name").notNull()
    table.string("slug").notNull().unique()


exports.down = (knex, Promise) -> knex.schema.dropTable "locations"
