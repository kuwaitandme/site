exports.up = (knex, Promise) ->
  knex.schema.createTable "sharing_item_statuses", (table) ->
    table.increments().primary()
    table.string("name").notNull().unique()


exports.down = (knex, Promise) -> knex.schema.dropTable "sharing_item_statuses"