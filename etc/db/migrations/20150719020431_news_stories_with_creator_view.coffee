exports.up = (knex, Promise) ->
  knex.raw "CREATE view news_stories_with_creator_view AS
    SELECT n.*, u.username AS created_by_username
      FROM news_stories AS n, users AS u
      WHERE n.created_by = u.id"

exports.down = (knex, Promise) -> knex.raw "DROP VIEW news_stories_with_creator_view"
