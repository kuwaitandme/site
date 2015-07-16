exports.up = (knex, Promise) ->
  knex.schema.createTable "chats", (table) ->
    table.increments().primary()
    table.json("data").defaultTo "{}"
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"


exports.down = (knex, Promise) -> knex.schema.dropTable "chats"
