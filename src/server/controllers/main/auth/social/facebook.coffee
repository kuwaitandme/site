passport = require "passport"

exports = module.exports = ->
  controller = (request, response, next) -> passport.authenticate "facebook"


exports["@singleton"] = true