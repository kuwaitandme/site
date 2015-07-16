exports.up = (knex, Promise) ->
  knex.schema.createTable "news_category_filters", (table) ->
    table.increments().primary()
    table.integer("user").notNull().references("id").inTable "users"
    table.integer("category").notNull().references("id").inTable "news_categories"
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"
    table.unique ["category", "user"]

exports.down = (knex, Promise) -> knex.schema.dropTable "news_category_filters"
