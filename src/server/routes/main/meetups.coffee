module.exports = (route) ->
  route "/meetups",          "meetups/index"
  route "/meetups/find",     "meetups/index"
  route "/meetups/create",   "meetups/index"
  route "/meetups/view",     "meetups/index"
