exports.up = (knex, Promise) ->
  knex.schema.table "child_categories", (table) ->
    (table.foreign "parent_category").references("id").inTable "parent_categories"

exports.down = (knex, Promise) ->
  knex.schema.table "child_categories", (table) ->
    table.dropForeign "parent_category"
