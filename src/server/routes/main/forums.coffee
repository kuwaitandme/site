module.exports = (route) ->
  route "/forums",                            "forums/index"
  route "/forums/category/([0-9a-z\-]*)",     "forums/index"
  route "/forums/groups",                     "forums/index"
  route "/forums/recent",                     "forums/index"
  route "/forums/tags",                       "forums/index"
  route "/forums/topic/([0-9a-z\-]*)",        "forums/index"
