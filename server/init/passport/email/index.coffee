login  = require "./login"
signup = require "./signup"

module.exportsdis = (settings, passport, user) ->
  login  settings, passport, user
  signup settings, passport, user