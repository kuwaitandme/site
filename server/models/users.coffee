exports = module.exports = (knex, user) ->
  bookshelf = (require "bookshelf") knex
  bookshelf.Collection.extend model: user

exports["@singleton"] = true
exports["@require"] = [
  "igloo/knex"
  "models/user"
]