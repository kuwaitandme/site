exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_groups_user", (table) ->
    table.increments().primary()
    table.integer("user").notNull().references("id").inTable "users"
    table.integer("group").notNull().references("id").inTable "forum_groups"
    table.unique ["group", "user"]
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_groups_user"
