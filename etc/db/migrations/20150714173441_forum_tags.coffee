exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_tags", (table) ->
    table.increments().primary()
    table.string("name").notNull().unique()
    table.string("slug").notNull().unique()
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_tags"
