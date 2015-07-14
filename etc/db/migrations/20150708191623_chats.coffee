exports.up = (knex, Promise) ->
  knex.schema.createTable "chats", (table) ->
    table.increments().primary()
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"
    table.json("data").defaultTo "{}"


exports.down = (knex, Promise) -> knex.schema.dropTable "chats"
