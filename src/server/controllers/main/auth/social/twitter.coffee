passport = require "passport"

exports = module.exports = -> passport.authenticate "twitter"

exports["@singleton"] = true