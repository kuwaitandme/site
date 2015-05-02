exports = module.exports = (knex) ->
  bookshelf = (require "bookshelf") knex
  model = bookshelf.Model.extend tableName: "classifieds"

exports["@singleton"] = true
exports["@require"] = [ "igloo/knex" ]