exports = module.exports = (knex, classified) ->
  bookshelf = (require "bookshelf") knex
  bookshelf.Collection.extend model: classified

exports["@singleton"] = true
exports["@require"] = [
  "igloo/knex"
  "models/classified"
]