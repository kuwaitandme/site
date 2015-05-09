exports.up = (knex, Promise) ->
  knex.schema.createTable "classifieds", (table) ->
    table.increments().primary()
    (table.string "title").notNull()
    (table.string "slug").notNull()
    (table.text "description").notNull()
    (table.integer "parent_category").notNull().references("id").inTable "parent_categories"
    (table.integer "child_category").references("id").inTable "child_categories"
    (table.integer "location").notNull().references("id").inTable "locations"
    (table.integer "owner").references("id").inTable "users"
    (table.integer "priceType").notNull()
    (table.integer "priceValue")
    (table.integer "language").notNull().defaultTo 0
    (table.integer "weight").notNull().defaultTo 0
    (table.integer "status").notNull()
    (table.json "contact")
    (table.json "images")
    (table.json "meta")
    (table.integer "type").notNull().defaultTo 0
    (table.timestamp "created").notNull().defaultTo knex.raw "now()"

exports.down = (knex, Promise) -> knex.schema.dropTable "classifieds"