exports.up = (knex, Promise) ->
  knex.schema.createTable "chats_rooms", (table) ->
    table.increments().primary()
    table.integer("disabled").defaultTo
    table.text("title").notNull()
    table.integer("status").notNull().references("id").inTable "chats_room_statuses"
    table.json("data").defaultTo "{}"
    table.timestamps()


exports.down = (knex, Promise) -> knex.schema.dropTable "chats_rooms"
