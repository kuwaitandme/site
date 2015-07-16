exports.up = (knex, Promise) ->
  knex.schema.createTable "forum_topic_tags", (table) ->
    table.increments().primary()
    table.integer("topic").notNull().references("id").inTable "forum_topics"
    table.integer("tag").notNull().references("id").inTable "forum_tags"
    table.unique ["tag", "topic"]


exports.down = (knex, Promise) -> knex.schema.dropTable "forum_topic_tags"
