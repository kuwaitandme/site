exports.up = (knex, Promise) ->
  knex.schema.createTable "notifications", (table) ->
    table.increments().primary()
    (table.integer "user").references("id").inTable "users"
    (table.string "message").notNull()
    (table.integer "hasRead").notNull().defaultTo 0
    (table.timestamp "timestamp").notNull().defaultTo knex.raw "now()"
    (table.json "data")

exports.down = (knex, Promise) -> knex.schema.dropTable "notifications"
