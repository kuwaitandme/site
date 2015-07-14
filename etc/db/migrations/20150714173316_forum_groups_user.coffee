exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_groups_user", (table) ->
    table.increments().primary()
    table.integer("user").notNull().references("id").inTable "users"
    table.integer("forum_group").notNull().references("id").inTable "forum_groups"
    table.unique ["forum_group", "user"]
    table.timestamps()


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_groups_user"
