exports.up = (knex, Promise) ->
  knex.raw "ALTER TABLE users ADD UNIQUE (email)"

exports.down = (knex, Promise) ->
  knex.raw "ALTER TABLE users DROP CONSTRAINT users_email_key"
