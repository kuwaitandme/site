exports.up = (knex, Promise) ->
  knex.schema.createTable "logs", (table) ->
    table.increments().primary()
    table.integer("user").index().notNull().references("id").inTable "users"
    table.string("ip").index().notNull()
    table.integer("type").index().notNull().references("id").inTable "log_types"
    table.json("meta").defaultTo "{}"
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"


exports.down = (knex, Promise) -> knex.schema.dropTable "logs"
