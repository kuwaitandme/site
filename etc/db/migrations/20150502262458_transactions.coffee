exports.up = (knex, Promise) ->
  knex.schema.createTable "transactions", (table) ->
    table.increments().primary()
    (table.integer "user").references("id").inTable "users"
    (table.string "paypal_id").notNull()
    (table.integer "amount").notNull()
    (table.integer "credits").notNull()
    (table.integer "state").notNull().defaultTo 0
    (table.json "extra")
    (table.timestamp "timestamp").notNull().defaultTo knex.raw "now()"

exports.down = (knex, Promise) -> knex.schema.dropTable "events"