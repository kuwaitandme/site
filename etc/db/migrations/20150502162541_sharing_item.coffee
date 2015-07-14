exports.up = (knex, Promise) ->
  knex.schema.createTable "sharing_item", (table) ->
    table.increments().primary()
    table.string("title").notNull()
    table.string("slug").notNull().unique()
    table.text("description").notNull()
    table.integer("parent_category").notNull().references("id").inTable "sharing_categories"
    table.integer("child_category").references("id").inTable "sharing_categories"
    table.integer("location").notNull().references("id").inTable "locations"
    table.integer("owner").notNull().references("id").inTable "users"
    table.integer("price_type").notNull().references("id").inTable "sharing_price_types"
    table.integer("price_value").defaultTo 0
    table.integer("language").notNull().references("id").inTable "languages"
    table.integer("weight").notNull().defaultTo 0
    table.integer("status").notNull().references("id").inTable "sharing_statuses"
    table.integer("view_count").notNull().defaultTo 0
    table.json("contact").defaultTo "{}"
    table.json("images").defaultTo "[]"
    table.json("meta").defaultTo "{}"
    table.integer("type").notNull().references("id").inTable "sharing_types"
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("modified_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"


exports.down = (knex, Promise) -> knex.schema.dropTable "sharing_item"
