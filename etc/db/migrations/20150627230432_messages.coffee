exports.up = (knex, Promise) ->
  knex.schema.createTable "messages", (table) ->
    table.increments().primary()
    (table.string "from_name")
    (table.string "from_email").notNull()
    (table.integer "from_user").references("id").inTable "users"
    (table.text "message").notNull()
    (table.integer "to_user").notNull().references("id").inTable "users"
    (table.timestamp "created").notNull().defaultTo knex.raw "now()"

exports.down = (knex, Promise) -> knex.schema.dropTable "messages"
