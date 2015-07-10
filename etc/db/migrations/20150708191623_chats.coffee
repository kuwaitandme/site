exports.up = (knex, Promise) ->
  knex.schema.createTable "chats", (table) ->
    table.increments().primary()
    (table.integer "user1").references("id").inTable "users"
    (table.integer "user2").references("id").inTable "users"
    (table.string "read_token").notNull()
    (table.timestamp "created").notNull().defaultTo knex.raw "now()"
    (table.timestamp "last_modified").notNull().defaultTo knex.raw "now()"
    (table.json "data")

exports.down = (knex, Promise) -> knex.schema.dropTable "chats"
