exports = module.exports = (knex) ->
  bookshelf = (require "bookshelf") knex
  model = bookshelf.Model.extend tableName: "locations"
  bookshelf.Collection.extend model: model

exports["@singleton"] = true
exports["@require"] = ["igloo/knex"]