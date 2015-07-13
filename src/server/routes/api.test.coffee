expect           = require "expect.js"
supertest        = require "supertest"


exports = module.exports = (IoC) -> (app) ->
  # Test if API routes are accessible here.

exports["@require"] = [
  "$container"
  "models/users"
]
exports["@singleton"] = true
