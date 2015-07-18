exports.up = (knex, Promise) ->
  knex.schema.createTable "chats_rooms_users", (table) ->
    table.increments().primary()
    table.integer("room").notNull().references("id").inTable "chats_rooms"
    table.integer("user").notNull().references("id").inTable "users"
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"
    table.unique ["room", "user"]


exports.down = (knex, Promise) -> knex.schema.dropTable "chats_rooms_users"
