module.exports = (route) ->
  route "/sharing/item/([^/]+-[0-9]+)",                "sharing/single"
  route "/sharing/categories",                         "sharing/categories"
  route "/sharing/create",                             "sharing/create"
  route "/sharing/search",                             "sharing/search"
  route "/sharing/search/([0-9a-z\-]*)",               "sharing/search"
  route "/sharing/search/([0-9a-z\-]+)/([0-9a-z\-]*)", "sharing/search"
  route "/sharing/finish/([0-9]+)",                    "sharing/finish"

  # Add our special redirection route..
  # route "/c/([0-9]+)",                                 "redirector/sharing"
