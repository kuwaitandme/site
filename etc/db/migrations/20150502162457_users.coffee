exports.up = (knex, Promise) ->
  knex.schema.createTable "users", (table) ->
    table.increments().primary()
    (table.string "email").notNull()
    (table.string "password").notNull()
    (table.string "full_name").notNull()
    (table.json "personal")
    (table.json "meta")
    (table.integer "credits").notNull().defaultTo 0
    (table.integer "type").notNull()
    (table.boolean "moderator").notNull().defaultTo false
    (table.timestamp "created").notNull().defaultTo knex.raw "now()"

exports.down = (knex, Promise) -> knex.schema.dropTable "users"