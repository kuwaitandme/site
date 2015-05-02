exports = module.exports = (knex) ->
  bookshelf = (require "bookshelf") knex
  bookshelf.Model.extend tableName: "classifieds"

exports["@singleton"] = true
exports["@require"] = [ "igloo/knex" ]