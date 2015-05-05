express   = require "express"

exports = module.exports = (IoC) ->
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

  # Handler to display the 404 page
  fourofour = (request, response, next) ->
    error = new Error "Not Found"
    error.status = 404
    response.render "error",
      error: error
      message: error.message
      status: error.status or 500


  error = (error, request, response, next) ->
    # Set the default error code to 500
    response.status error.status or 500

    # In production, no stack-traces leaked to user
    # if global.config.mode == "production" then error = {}
    # else error = error

    # else log error into a file and show error page
    # if error.status != 404 then logError err, request
    response.render "error",
      status: error.status or 500
      message: error.message
      error: error


  # This helper function shortens the long line of writings routes and calling
  # the dependency injector.
  _route = (url, controller) ->
    if typeof controller is "string"
      controller = IoC.create "controllers/main/#{controller}"
    router.get (new RegExp "^#{url}/?$"), controller


  # # First off, based on the language slug in the URL set the variables
  # # in the request.
  # router.get /^\/(ar|en|dg).*\/?$/, setLanguage

  # Then start matching all the different routes for the app
  _route "",               "landing"
  _route "/about",         "about"
  _route "/contact",       "contact"
  # _route "/donate",        "donate"
  # _route "/rss",           "rss"
  _route "/terms-privacy", "terms-privacy"

  # _route "/auth/forgot", "auth/forgot"
  _route "/auth/login",                    "auth/login"
  _route "/auth/logout",                   "auth/logout"
  _route "/auth/signup",                   "auth/signup"
  _route "/auth/social/facebook",          "auth/social/facebook"
  _route "/auth/social/facebook/callback", "auth/social/callback/facebook"
  _route "/auth/social/google",            "auth/social/google"
  _route "/auth/social/google/callback",   "auth/social/callback/google"
  _route "/auth/social/twitter",           "auth/social/twitter"
  _route "/auth/social/twitter/callback",  "auth/social/callback/twitter"

  _route "/classified/post",                  "classified/post"
  _route "/classified",                       "classified/search"
  _route "/classified/([a-z\-]*)",            "classified/search"
  _route "/classified/([a-z\-]*)/([a-z\-]*)", "classified/search"
  # _route "/classified/([a-zf0-9]*)/finish",   "classified/finish"
  # _route "/classified/([a-zf0-9]*)/edit",     "classified/edit"
  # _route "/classified/([a-zf0-9]*)",          "classified/single"

  _route "/account",                          "account/index"
  _route "/account/manage",                   "account/manage"
  # _route "/account/credits", "account/credits"
  # _route "/account/profile", "account/profile"

  _route "/([^/]+)",                          "classified/single"
  # If language slug is present but page has not matched any url give 404 page
  _route  ".+", fourofour

  # # If language slug is missing and redirect to a preferred language
  # router.get /^(?:[^aed]|a[^r]|e[^n]|d[^g])(.*)/, langRedirect

  app.use router

  # Error page hander
  app.use error


exports["@require"] = ["$container"]
exports["@singleton"] = true