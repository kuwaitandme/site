exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_topic_tags", (table) ->
    table.increments().primary()
    table.integer("forum_topic").notNull().references("id").inTable "forum_topics"
    table.integer("forum_tag").notNull().references("id").inTable "forum_tags"
    table.unique ["forum_tag", "forum_topic"]


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_topic_tags"
