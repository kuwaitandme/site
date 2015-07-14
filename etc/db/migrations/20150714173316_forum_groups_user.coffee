exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_groups_user", (table) ->
    table.increments().primary()
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.integer("user").references("id").inTable "users"
    table.integer("forum_group").references("id").inTable "forum_groups"
    table.unique ["forum_group", "user"]


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_groups_user"
