exports.up = (knex, Promise) ->
  knex.schema.createTable "comments", (table) ->
    table.increments().primary()
    table.text("content").notNull().defaultTo ""
    table.text("content_markdown")
    table.string("slug").unique().index().notNull().defaultTo ""
    table.integer("upvotes").notNull().defaultTo 0
    table.integer("downvotes").notNull().defaultTo 0
    table.decimal("confidence", 20, 19).index().notNull().defaultTo 0.0
    table.integer("parent").references("id").inTable "comments"
    table.boolean("is_deleted").defaultTo false
    table.boolean("is_moderated").defaultTo false
    # table.integer("hat_id")
    table.integer("created_by").notNull().references("id").inTable "users"
    table.integer("updated_by").references("id").inTable "users"
    table.json("meta").defaultTo "{}"
    table.timestamp("created_at").notNull().defaultTo knex.raw "now()"
    table.timestamp("updated_at").notNull().defaultTo knex.raw "now()"


exports.down = (knex, Promise) -> knex.schema.dropTable "comments"
