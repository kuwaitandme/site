exports.up = (knex, Promise) ->
  knex.schema.createTable "log_types", (table) ->
    table.increments().primary()
    table.string("name").notNull().unique()
    table.string("message").notNull()


exports.down = (knex, Promise) -> knex.schema.dropTable "log_types"
