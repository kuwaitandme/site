exports.up = (knex, Promise) ->
  Promise.all [
    knex.raw "ALTER TABLE classifieds ALTER COLUMN contact SET DEFAULT '{}'"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN images SET DEFAULT '[]'"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN location SET DEFAULT 0"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN meta SET DEFAULT '{}'"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN owner SET NOT NULL"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN price_value SET DEFAULT 0"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN slug SET DEFAULT ''"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN status SET DEFAULT 0"
  ]


exports.down = (knex, Promise) ->
  Promise.all [
    knex.raw "ALTER TABLE classifieds ALTER COLUMN contact DROP DEFAULT"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN images DROP DEFAULT"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN location DROP DEFAULT"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN meta DROP DEFAULT"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN owner DROP NOT NULL"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN price_value DROP DEFAULT"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN slug DROP DEFAULT"
    knex.raw "ALTER TABLE classifieds ALTER COLUMN status DROP DEFAULT"
  ]
