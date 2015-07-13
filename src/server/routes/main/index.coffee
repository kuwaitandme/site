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
  route = (url, controller) ->
    if typeof controller is "string"
      controller = IoC.create "controllers/main/#{controller}"
    router.get (new RegExp "^#{url}/?$"), controller


  # Add route for the landing page
  route "",                                       "landing"

  # Add route for each of the sub-pages
  (require "./account") route
  (require "./auth") route
  (require "./classifieds") route
  (require "./info") route

  # Add the final 404 route!
  route ".*",                                      "errors/404"
  app.use router


exports["@require"] = [
  "$container"
  "igloo/settings"
]
exports["@singleton"] = true
