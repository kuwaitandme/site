exports.up = (knex, Promise) ->
  knex.schema.createTable "events", (table) ->
    table.increments().primary()
    (table.integer "user").references("id").inTable "users"
    (table.string "ip").notNull()
    (table.integer "type").notNull()
    (table.json "data")
    (table.timestamp "timestamp").notNull().defaultTo knex.raw "now()"

exports.down = (knex, Promise) -> knex.schema.dropTable "events"