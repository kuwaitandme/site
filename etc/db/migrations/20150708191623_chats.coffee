exports.up = (knex, Promise) ->
  knex.schema.createTable "chats", (table) ->
    table.increments().primary()
    table.json("data").defaultTo "{}"
    table.timestamps()


exports.down = (knex, Promise) -> knex.schema.dropTable "chats"
