exports.up = (knex, Promise) ->
  knex.schema.createTable "users", (table) ->
    table.increments().primary()
    table.string("email").notNull().unique()
    table.string("username").notNull().unique()
    table.string("slug").notNull().unique()
    table.string("password").notNull()
    table.string("signature").defaultTo ""
    table.text("about").defaultTo ""
    table.json("login_providers").defaultTo "{}"
    table.string("name").notNull().defaultTo "Anonymous"
    table.json("personal").defaultTo "{}"
    table.json("meta").defaultTo "{}"
    table.integer("credits").notNull().defaultTo 0
    table.integer("view_count").notNull().defaultTo 0
    table.integer("language").notNull().references("id").inTable "languages"
    table.integer("status").notNull().references("id").inTable "user_statuses"
    table.integer("role").notNull().references("id").inTable "user_roles"
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"


exports.down = (knex, Promise) -> knex.schema.dropTable "users"
