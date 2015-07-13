module.exports = (route) ->
  route "/classified/([^/]+-[0-9]+)",                    "classifieds/single"
  route "/classifieds/categories",                       "classifieds/categories"
  route "/classifieds/create",                           "classifieds/create"
  route "/classifieds/find",                             "classifieds/search"
  route "/classifieds/find/([0-9a-z\-]*)",               "classifieds/search"
  route "/classifieds/find/([0-9a-z\-]+)/([0-9a-z\-]*)", "classifieds/search"
  route "/classifieds/finish/([0-9]+)",                  "classifieds/finish"

  # Add our special redirection route..
  route "/c/([^/]+)",                                "redirector/classifieds"
