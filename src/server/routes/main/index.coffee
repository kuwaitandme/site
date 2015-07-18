###*
 * This file is mainly responsible for setting up all the different routes for
 * the App. You'll find routes for the Meetups, Forums and other components
 * of the site get defined here.
 *
 * The routes here get defined by a function which takes care of any i18n
 * issues. There is a helper function defined below (function route(..)) that
 * is used to define all the routes. This function takes care of initializing
 * the controller using electrolyte and automatically creates the regex version
 * of the route.
###
express   = require "express"

exports = module.exports = (IoC, settings) ->
  app = this
  router = express.Router()


  ###*
   * Function to properly set the language based on the language slug. This
   * function acts more as a custom middleware.
   *
   * @todo This function is not implemented as we don't really have i18n
   * support yet.
  ###
  setLanguage = (request, response, next) ->
    # If the language cookie was not set, then set it.
    if not request.cookies["l"] then response.cookie "l", request.getLocale()
    # Read the cookies which sets the language.
    else response.setLocale request.cookies["l"]

    # Goto the next middleware.
    next()


  ###*
   * This helper function shortens the long line of writings routes and calling
   * the dependency injector.
   *
   * @param  String url           The url to match
   * @param  String controller    The controller to include
  ###
  route = (url, controller) ->
    if typeof controller is "string"
      controller = IoC.create "controllers/#{controller}"
    router.get (new RegExp "^#{url}/?$"), controller

  # Have all the routes redirect to the news page for now

  # Add route for the landing page
  # route "",              "index"

  # Add route for each of the sub-pages
  # (require "./account")  route
  # (require "./auth")     route
  # (require "./food")     route
  # (require "./forums")   route
  # (require "./info")     route
  # (require "./meetups")  route
  # (require "./sharing")  route
  # (require "./shopping") route
  require("./news")     route

  # If none of the routes matched, then route to the 404 controller!
  route ".*",            "errors/404"

  # Finally attach the router into the app
  app.use                router


exports["@require"] = [
  "$container"
  "igloo/settings"
]
exports["@singleton"] = true
