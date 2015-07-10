exports.up = (knex, Promise) ->
  knex.schema.createTable "chat_messages", (table) ->
    table.increments().primary()
    (table.integer "chatroom").references("id").inTable "chats"
    (table.integer "author").references("id").inTable "users"
    (table.text "message").notNull()
    (table.integer "has_read").notNull().defaultTo 0
    (table.timestamp "read_timestamp")
    (table.timestamp "created").notNull().defaultTo knex.raw "now()"
    (table.json "data")

exports.down = (knex, Promise) -> knex.schema.dropTable "chat_messages"
