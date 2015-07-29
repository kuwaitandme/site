module.exports = (route) ->
  route "/forums",                            "forums/index"
  route "/forums/category/([0-9a-z\-]*)",     "forums/category"
  route "/forums/groups",                     "forums/index"
  route "/forums/recent",                     "forums/recent"
  route "/forums/popular",                    "forums/recent"
  route "/forums/tags",                       "forums/index"
  route "/forums/topic/([0-9a-z\-]*)",        "forums/topic"
