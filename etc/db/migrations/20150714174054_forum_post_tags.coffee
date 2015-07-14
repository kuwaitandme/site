exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_post_tags", (table) ->
    table.increments().primary()
    table.integer("forum_post").notNull().references("id").inTable "forum_posts"
    table.integer("forum_tag").notNull().references("id").inTable "forum_tags"
    table.unique ["forum_tag", "forum_post"]


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_post_tags"
