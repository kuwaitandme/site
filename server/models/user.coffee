exports = module.exports = (knex) ->
  bookshelf = (require "bookshelf") knex
  bookshelf.Model.extend tableName: "users"

exports["@singleton"] = true
exports["@require"] = ["igloo/knex"]