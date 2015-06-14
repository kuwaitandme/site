exports.up = (knex, Promise) ->
  knex.schema.table "classifieds", (table) ->
    table.renameColumn "priceValue", "price_value"
    table.renameColumn "priceType", "price_type"


exports.down = (knex, Promise) ->
  knex.schema.table "classifieds", (table) ->
    table.renameColumn "price_value", "priceValue"
    table.renameColumn "price_type", "priceType"
