exports.up = (knex, Promise) ->
  knex.schema.createTable "chats_messages", (table) ->
    table.increments().primary()
    table.integer("user").references("id").inTable "users"
    table.text("message").notNull()
    table.json("data").defaultTo "{}"
    table.timestamps()


exports.down = (knex, Promise) -> knex.schema.dropTable "chats_messages"
