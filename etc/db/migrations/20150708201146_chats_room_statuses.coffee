exports.up = (knex, Promise) ->
  knex.schema.createTable "chats_room_statuses", (table) ->
    table.increments().primary()
    table.string("name").notNull()
    table.string("slug").notNull().unique()


exports.down = (knex, Promise) -> knex.schema.dropTable "chats_room_statuses"
