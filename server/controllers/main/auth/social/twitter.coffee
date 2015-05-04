passport = require "passport"

exports = module.exports = ->
  controller = (request, response, next) -> passport.authenticate "twitter"


exports["@singleton"] = true