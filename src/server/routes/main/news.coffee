module.exports = (route) ->
  route "/n/([0-9]+)",                                 "news/redirector"
  route "/news",                                       "news/index"
  route "/news/categories",                            "news/categories"
  route "/news/category/([0-9a-z]+)/page/([0-9]+)",    "news/index"
  route "/news/category/([0-9a-z]+)?",                 "news/index"
  route "/news/comments",                              "news/index"
  route "/news/comments/page/([0-9]+)",                "news/index"
  route "/news/create",                                "news/index"
  route "/news/hottest",                               "news/index"
  route "/news/moderations",                           "news/index"
  route "/news/newest",                                "news/index"
  route "/news/newest/page/([0-9]+)?",                 "news/index"
  route "/news/page/([0-9]+)?",                        "news/index"
  route "/news/recent",                                "news/recent"
  route "/news/recent/page/([0-9]+)?",                 "news/recent"
  route "/news/rss",                                   "news/index"
  route "/news/search",                                "news/index"
  route "/news/stories",                               "news/index"
  route "/news/stories/preview",                       "news/index"
  route "/news/story/([a-z0-9\-]+)",                   "news/single"
