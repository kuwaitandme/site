exports.up = (knex, Promise) ->
  knex.schema.createTable "sharing_categories", (table) ->
    table.increments().primary()
    table.string("name").notNull()
    table.string("slug").notNull().unique()
    table.integer("parent").references("id").inTable "sharing_categories"


exports.down = (knex, Promise) -> knex.schema.dropTable "sharing_categories"
