exports.up = (knex, Promise) ->
  knex.schema.createTable "chats_rooms", (table) ->
    table.increments().primary()
    table.text("title").notNull()
    table.integer("status").notNull().references("id").inTable "chats_room_statuses"
    table.json("data").defaultTo "{}"
    table.boolean("disabled").defaultTo false
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"


exports.down = (knex, Promise) -> knex.schema.dropTable "chats_rooms"
