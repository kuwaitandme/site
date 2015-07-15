module.exports = (route) ->
  route "/user/([0-9a-z\-]*)",     "meetups/index"
