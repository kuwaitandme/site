exports.up = (knex, Promise) ->
  knex.schema.createTable "chats_rooms_users", (table) ->
    table.increments().primary()
    table.integer("chats_room").notNull().references("id").inTable "chats_room_statuses"
    table.integer("user").notNull().references("id").inTable "users"
    table.timestamps()
    table.unique ["chats_room", "user"]


exports.down = (knex, Promise) -> knex.schema.dropTable "chats_rooms_users"
