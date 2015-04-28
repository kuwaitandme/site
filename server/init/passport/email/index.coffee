login  = require './login'
signup = require './signup'

module.exports = (settings, passport, user) ->
  console.log 'sdf', user
  login  settings, passport, user
  signup settings, passport, user