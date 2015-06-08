express   = require "express"

exports = module.exports = (IoC, settings) ->
  app = this
  router = express.Router()

  # Function to properly set the language based on the language slug
  setLanguage = (request, response, next) ->
    response.cookie "l", request.params[0]
    response.setLocale request.params[0]
    next()

  # Function to redirect to a language
  langRedirect = (request, response, next) ->
    if not request.cookies["l"] then response.cookie "l", request.getLocale()
    response.setLocale request.cookies["l"]
    response.redirect "/#{request.getLocale()}#{request.url}"


  # This helper function shortens the long line of writings routes and calling
  # the dependency injector.
  _route = (url, controller) ->
    if typeof controller is "string"
      controller = IoC.create "controllers/main/#{controller}"
    router.get (new RegExp "^#{url}/?$"), controller


  _route "",                                       "landing"
  # _route "/rss",                                "rss"

  _route "/info/about",                             "info/about"
  _route "/info/contact",                           "info/contact"
  _route "/info/donate",                            "info/donate"
  _route "/info/terms-privacy",                     "info/terms-privacy"

  _route "/auth",                                   "auth/index"
  # _route "/auth/forgot",                            "auth/forgot"
  _route "/auth/logout",                            "auth/logout"
  _route "/auth/oauth/([a-z]+)",                    "auth/oauth/index"
  _route "/auth/oauth/([a-z]+)/callback",           "auth/oauth/callback"

  _route "/classified/post",                        "classified/post"
  _route "/classified",                             "classified/search"
  _route "/classified/([a-z\-]*)",                  "classified/search"
  _route "/classified/([0-9a-z\-]+)/([0-9a-z\-]*)", "classified/search"
  _route "/classified/finish/([0-9]+)",             "classified/finish"
  _route "/classified/edit/([0-9]*)",               "classified/edit"

  _route "/account",                                "account/index"
  _route "/account/classifieds",                    "account/classifieds"
  _route "/account/classifieds/([0-9]*)",           "account/classifieds"
  _route "/account/moderate",                       "account/moderate"
  _route "/account/moderate/([0-9]*)",              "account/moderate"
  # _route "/account/credits", "account/credits"
  # _route "/account/profile", "account/profile"

  _route "/c/([^/]+)",                              "redirector/classifieds"
  _route "/(en|ar|dg)",                             "redirector/language"
  _route "/(en|ar|dg)/(.*)",                        "redirector/language"
  _route "/(.+)",                                   "redirector/oldUrls"
  _route "/([^/]+-[0-9]+)",                         "classified/single"
  _route ".*",                                      "errors/404"
  app.use router


exports["@require"] = [
  "$container"
  "igloo/settings"
]
exports["@singleton"] = true
