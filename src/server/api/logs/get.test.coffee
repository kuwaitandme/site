expect           = require "expect.js"
supertest        = require "supertest"

exports = module.exports = (IoC) -> (app) ->

exports["@require"] = ["$container"]
exports["@singleton"] = true
